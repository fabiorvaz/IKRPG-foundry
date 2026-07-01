/**
 * Sheet class for Career items.
 * Manages view options, templates, and data context for rendering the career sheet.
 */
export class IKRPGCareerSheet extends ItemSheet {
  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["ikrpg", "sheet", "item", "career"],
      width: 620,
      height: 680,
      tabs: [{
        navSelector: ".sheet-tabs",
        contentSelector: ".sheet-body",
        initial: "general"
      }]
    });
  }

  /** @override */
  get template() {
    return "systems/ikrpg/templates/items/career-sheet.hbs";
  }

  /** @override */
  getData(options) {
    const context = super.getData(options);
    
    // Provide direct reference to system fields for easier template access
    context.system = this.item.system;

    // Obter as perícias configuradas no sistema
    const allSkills = game.settings.get("ikrpg", "customSkills") || [];
    
    const mapSkill = (s) => {
      let displayName = s.nameKey ? game.i18n.localize(s.nameKey) : s.name;
      if (displayName === s.nameKey) displayName = s.name;
      return {
        id: s.id,
        name: displayName || s.name || s.id
      };
    };

    const militaryChoices = allSkills.filter(s => s.category === "military").map(mapSkill);
    const socialChoices = allSkills.filter(s => s.category === "social").map(mapSkill);
    const careerChoices = allSkills.filter(s => s.category === "professional").map(mapSkill);

    // Enriquecimento dinâmico para perícias desconhecidas/deletadas que estão salvas no item
    const addUnknownChoices = (currentSkills, choices) => {
      for (const cs of (currentSkills || [])) {
        if (cs.id && !choices.some(c => c.id === cs.id)) {
          const labelDesconhecido = game.i18n.localize("IKRPG.Career.UnknownSkill") || "Desconhecida";
          choices.push({
            id: cs.id,
            name: `[${labelDesconhecido}] ${cs.name || cs.id}`
          });
        }
      }
    };

    addUnknownChoices(this.item.system.militarySkills, militaryChoices);
    addUnknownChoices(this.item.system.socialSkills, socialChoices);
    addUnknownChoices(this.item.system.careerSkills, careerChoices);

    context.militaryChoices = militaryChoices;
    context.socialChoices = socialChoices;
    context.careerChoices = careerChoices;

    return context;
  }

  /** @override */
  async _updateObject(event, formData) {
    const allSkills = game.settings.get("ikrpg", "customSkills") || [];
    
    // Sincronizar o nome com as configurações do sistema dinamicamente
    const populateNames = (prefix) => {
      const keys = Object.keys(formData).filter(k => k.startsWith(prefix) && k.endsWith(".id"));
      for (const key of keys) {
        const idValue = formData[key];
        const nameKey = key.replace(/\.id$/, ".name");
        
        if (idValue) {
          const skill = allSkills.find(s => s.id === idValue);
          if (skill) {
            let displayName = skill.nameKey ? game.i18n.localize(skill.nameKey) : skill.name;
            if (displayName === skill.nameKey) displayName = skill.name;
            formData[nameKey] = displayName || skill.name || idValue;
          } else {
            // Se o ID é desconhecido, tenta preservar o nome antigo caso já estivesse no item
            const index = key.match(/\.(\d+)\.id$/)?.[1];
            const originalSkills = foundry.utils.getProperty(this.item, prefix) || [];
            const originalName = originalSkills[index]?.name || idValue;
            formData[nameKey] = originalName;
          }
        } else {
          formData[nameKey] = "";
        }
      }
    };

    populateNames("system.militarySkills");
    populateNames("system.socialSkills");
    populateNames("system.careerSkills");

    return super._updateObject(event, formData);
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    const registerListActions = (addSelector, deleteSelector, path, defaultValue) => {
      html.find(addSelector).click(async (event) => {
        event.preventDefault();
        
        const list = Array.from(foundry.utils.getProperty(this.item, path) || []);
        list.push(foundry.utils.deepClone(defaultValue));
        
        // Uma única submissão com os novos dados mesclados
        await this._onSubmit(event, { updateData: { [path]: list } });
      });

      html.find(deleteSelector).click(async (event) => {
        event.preventDefault();
        const index = parseInt(event.currentTarget.dataset.index);
        
        const list = Array.from(foundry.utils.getProperty(this.item, path) || []);
        list.splice(index, 1);
        
        // Uma única submissão com os novos dados mesclados
        await this._onSubmit(event, { updateData: { [path]: list } });
      });
    };

    // Register actions for skills list
    registerListActions(".add-military-skill-btn", ".delete-military-skill-btn", "system.militarySkills", { id: "", name: "", levelInitial: 0, levelMax: 1 });
    registerListActions(".add-social-skill-btn", ".delete-social-skill-btn", "system.socialSkills", { id: "", name: "", levelInitial: 0, levelMax: 1 });
    registerListActions(".add-career-skill-btn", ".delete-career-skill-btn", "system.careerSkills", { id: "", name: "", levelInitial: 0, levelMax: 1 });

    // Register actions for abilities list
    registerListActions(".add-starting-ability-btn", ".delete-starting-ability-btn", "system.startingAbilities", { id: "", name: "" });
    registerListActions(".add-career-ability-btn", ".delete-career-ability-btn", "system.careerAbilities", { id: "", name: "" });

    // Register actions for spells list
    registerListActions(".add-starting-spell-btn", ".delete-starting-spell-btn", "system.startingSpells", { id: "", name: "" });
    registerListActions(".add-career-spell-btn", ".delete-career-spell-btn", "system.careerSpells", { id: "", name: "" });

    // Register actions for starting items list
    registerListActions(".add-starting-item-btn", ".delete-starting-item-btn", "system.startingItems", "");
  }
}
