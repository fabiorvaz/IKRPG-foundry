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

    return context;
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Helper to register add/delete click handlers for specific system array paths
    const registerListActions = (addSelector, deleteSelector, path, defaultValue) => {
      html.find(addSelector).click(async (event) => {
        event.preventDefault();
        // Submit sheet first to preserve any pending manual changes
        await this._onSubmit(event);
        
        const list = Array.from(foundry.utils.getProperty(this.item, path) || []);
        list.push(foundry.utils.deepClone(defaultValue));
        
        await this.item.update({ [path]: list });
      });

      html.find(deleteSelector).click(async (event) => {
        event.preventDefault();
        const index = parseInt(event.currentTarget.dataset.index);
        // Submit sheet first to preserve state
        await this._onSubmit(event);
        
        const list = Array.from(foundry.utils.getProperty(this.item, path) || []);
        list.splice(index, 1);
        
        await this.item.update({ [path]: list });
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
