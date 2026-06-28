/**
 * Classe da Ficha de Personagem do Jogador (Player Character Sheet).
 * Gerencia a visualização, opções e manipulação dos dados de um personagem.
 */
export class IKRPGCharacterSheet extends ActorSheet {
  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["ikrpg", "sheet", "actor", "character"],
      width: 750,
      height: 720,
      tabs: [{
        navSelector: ".sheet-tabs",
        contentSelector: ".sheet-body",
        initial: "attributes"
      }]
    });
  }

  /** @override */
  get template() {
    return "systems/ikrpg/templates/actors/character-sheet.hbs";
  }

  /** @override */
  getData(options) {
    const context = super.getData(options);
    context.system = this.actor.system;

    // Define se a raça permite o uso de Arcana (Magia)
    context.isArcanaAvailable = this.actor.system.attributes.arcana?.available !== false;

    // Categorizar itens embarcados do ator
    context.weaponsMelee = this.actor.items.filter(i => i.type === "meleeWeapon");
    context.weaponsRanged = this.actor.items.filter(i => i.type === "rangedWeapon");
    context.armor = this.actor.items.filter(i => i.type === "armor");
    context.consumables = this.actor.items.filter(i => i.type === "consumable");
    context.miscellaneous = this.actor.items.filter(i => i.type === "miscellaneous");
    context.abilities = this.actor.items.filter(i => i.type === "ability");
    context.spells = this.actor.items.filter(i => i.type === "spell");

    // Localizar raça, carreiras e arquétipo
    context.race = this.actor.items.find(i => i.type === "race") || null;
    context.careers = this.actor.items.filter(i => i.type === "career");
    context.archetype = this.actor.items.find(i => i.type === "archetype") || null;

    // Calcular valores máximos dos atributos primários com base na raça e no estágio/tier atual
    const tier = this.actor.system.tier || "heroic";
    context.maxStats = {};
    const baseStatsList = ["physique", "strength", "speed", "agility", "dexterity", "mastery", "intellect", "arcana", "perception"];
    
    for (const stat of baseStatsList) {
      if (context.race) {
        // A raça define o máximo do estágio
        const maxVal = context.race.system.maxStats?.[tier]?.[stat] ?? 0;
        context.maxStats[stat] = maxVal;
      } else {
        context.maxStats[stat] = "-";
      }
    }

    // Preparar lista de atributos básicos para dropdowns
    context.basicAttributes = {
      "physique": game.i18n.localize("IKRPG.Attribute.Physique") || "Físico",
      "strength": game.i18n.localize("IKRPG.Attribute.Strength") || "Força",
      "speed": game.i18n.localize("IKRPG.Attribute.Speed") || "Velocidade",
      "agility": game.i18n.localize("IKRPG.Attribute.Agility") || "Agilidade",
      "dexterity": game.i18n.localize("IKRPG.Attribute.Dexterity") || "Destreza",
      "mastery": game.i18n.localize("IKRPG.Attribute.Mastery") || "Maestria",
      "intellect": game.i18n.localize("IKRPG.Attribute.Intellect") || "Intelecto",
      "arcana": game.i18n.localize("IKRPG.Attribute.Arcana") || "Arcana",
      "perception": game.i18n.localize("IKRPG.Attribute.Perception") || "Percepção"
    };

    // Obter perícias configuradas no sistema para validação e exibição dinâmica de nomes
    const allSkills = game.settings.get("ikrpg", "customSkills") || [];

    // Preparar dados das perícias enriquecidas
    const enrichedSkills = (this.actor.system.skills || []).map((skill, index) => {
      const isArcana = skill.linkedAttribute === "arcana";
      const isArcanaAvailable = this.actor.system.attributes.arcana?.available !== false;
      
      let attributeValue = 0;
      let attributeDisplay = "-";

      if (isArcana && !isArcanaAvailable) {
        attributeValue = 0;
        attributeDisplay = "-";
      } else {
        attributeValue = this.actor.system.attributes[skill.linkedAttribute]?.value || 0;
        attributeDisplay = String(attributeValue);
      }

      const total = attributeValue + (skill.level || 0);

      // Buscar a perícia nas configurações do sistema
      const systemSkill = allSkills.find(s => s.id === skill.id);
      
      let displayName = "";
      let trainedOnly = skill.trainedOnly;
      let general = skill.general;

      if (systemSkill) {
        // Garantir sincronia dinâmica com as definições globais do sistema
        trainedOnly = !!systemSkill.trainedOnly;
        general = !!systemSkill.general;

        let nameKey = systemSkill.nameKey || skill.nameKey;
        if (nameKey) {
          displayName = game.i18n.localize(nameKey);
          if (displayName === nameKey) {
            displayName = systemSkill.name || skill.name || skill.id;
          }
        } else {
          displayName = systemSkill.name || skill.name || skill.id;
        }
      } else {
        // Perícia desconhecida/deletada nas configurações globais
        const labelDesconhecido = game.i18n.localize("IKRPG.Career.UnknownSkill") || "Desconhecida";
        displayName = `[${labelDesconhecido}] ${skill.name || skill.id}`;
      }

      return {
        ...skill,
        index,
        displayName,
        trainedOnly,
        general,
        attributeValue,
        attributeDisplay,
        total
      };
    });

    // Agrupar perícias enriquecidas por categoria
    context.militarySkills = enrichedSkills.filter(s => s.category === "military");
    context.professionalSkills = enrichedSkills.filter(s => s.category === "professional");
    context.socialSkills = enrichedSkills.filter(s => s.category === "social");

    // Preparar as caixas da espiral vital simples
    const buildTrackBoxes = (maxVal, currentDamage) => {
      const boxes = [];
      for (let i = 1; i <= maxVal; i++) {
        boxes.push({
          index: i,
          checked: i <= currentDamage
        });
      }
      return boxes;
    };

    const physiqueVal = this.actor.system.attributes.physique.value || 0;
    const agilityVal = this.actor.system.attributes.agility.value || 0;
    const intellectVal = this.actor.system.attributes.intellect.value || 0;

    const physique1_max = Math.ceil(physiqueVal / 2);
    const physique2_max = Math.floor(physiqueVal / 2);
    const agility1_max = Math.ceil(agilityVal / 2);
    const agility2_max = Math.floor(agilityVal / 2);
    const intellect1_max = Math.ceil(intellectVal / 2);
    const intellect2_max = Math.floor(intellectVal / 2);

    const spiralDmg = this.actor.system.vitalSpiral || {};

    context.physique1_boxes = buildTrackBoxes(physique1_max, spiralDmg.physique1 || 0);
    context.physique2_boxes = buildTrackBoxes(physique2_max, spiralDmg.physique2 || 0);
    context.agility1_boxes = buildTrackBoxes(agility1_max, spiralDmg.agility1 || 0);
    context.agility2_boxes = buildTrackBoxes(agility2_max, spiralDmg.agility2 || 0);
    context.intellect1_boxes = buildTrackBoxes(intellect1_max, spiralDmg.intellect1 || 0);
    context.intellect2_boxes = buildTrackBoxes(intellect2_max, spiralDmg.intellect2 || 0);

    // Caixas do Campo de Força (fixo em 6 caixas)
    context.forceField_boxes = buildTrackBoxes(6, this.actor.system.forceField?.damage || 0);

    // Opções de Tiers de evolução
    context.evolutionTiers = {
      heroic: game.i18n.localize("IKRPG.Character.TierHeroic") || "Heróico",
      veteran: game.i18n.localize("IKRPG.Character.TierVeteran") || "Veterano",
      epic: game.i18n.localize("IKRPG.Character.TierEpic") || "Épico"
    };

    return context;
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // 1. Ouvir alterações nos checkboxes da Espiral Vital simples
    html.find(".spiral-checkbox").click(async (event) => {
      event.preventDefault();
      const checkbox = event.currentTarget;
      const container = checkbox.closest(".track-checkboxes");
      const track = container.dataset.track;
      const clickedIndex = parseInt(checkbox.dataset.index);

      // Se clicar no checkbox que já corresponde ao nível atual de dano, desmarca ele
      // Caso contrário, define o dano para o índice clicado
      const currentDamage = this.actor.system.vitalSpiral[track] || 0;
      let newDamage = clickedIndex;
      if (currentDamage === clickedIndex) {
        newDamage = clickedIndex - 1;
      }

      await this.actor.update({ [`system.vitalSpiral.${track}`]: newDamage });
    });

    // Ouvir alterações nos checkboxes do Campo de Força
    html.find(".ff-checkbox").click(async (event) => {
      event.preventDefault();
      const checkbox = event.currentTarget;
      const container = checkbox.closest(".ff-checkboxes-container");
      const clickedIndex = parseInt(checkbox.dataset.index);

      const currentDamage = this.actor.system.forceField.damage || 0;
      let newDamage = clickedIndex;
      if (currentDamage === clickedIndex) {
        newDamage = clickedIndex - 1;
      }

      await this.actor.update({ "system.forceField.damage": newDamage });
    });

    // 2. Manipulação de Perícias diretamente na ficha
    html.find(".skill-level-input").change(async (event) => {
      const input = event.currentTarget;
      const index = parseInt(input.dataset.index);
      const val = Math.max(0, parseInt(input.value) || 0);

      const skills = Array.from(this.actor.system.skills || []);
      if (skills[index]) {
        skills[index].level = val;
        await this.actor.update({ "system.skills": skills });
      }
    });

    html.find(".skill-attribute-select").change(async (event) => {
      const select = event.currentTarget;
      const index = parseInt(select.dataset.index);
      const val = select.value;

      const skills = Array.from(this.actor.system.skills || []);
      if (skills[index]) {
        skills[index].linkedAttribute = val;
        await this.actor.update({ "system.skills": skills });
      }
    });

    // 3. Edição e Remoção de Itens Embedados
    html.find(".item-edit").click(event => {
      const itemId = event.currentTarget.closest(".item-row").dataset.itemId;
      const item = this.actor.items.get(itemId);
      if (item) item.sheet.render(true);
    });

    html.find(".item-delete").click(async (event) => {
      const itemId = event.currentTarget.closest(".item-row").dataset.itemId;
      const item = this.actor.items.get(itemId);
      if (item) {
        new Dialog({
          title: game.i18n.localize("IKRPG.Common.Delete") || "Excluir",
          content: `<p>Tem certeza de que deseja remover o item <strong>${item.name}</strong>?</p>`,
          buttons: {
            yes: {
              icon: '<i class="fas fa-trash"></i>',
              label: "Confirmar",
              callback: async () => {
                await item.delete();
              }
            },
            cancel: {
              icon: '<i class="fas fa-times"></i>',
              label: "Cancelar"
            }
          },
          default: "cancel"
        }).render(true);
      }
    });
  }

  /** @override */
  async _onDropItemCreate(itemData) {
    const items = Array.isArray(itemData) ? itemData : [itemData];

    for (const item of items) {
      // 1. Limitar a no máximo 1 raça
      if (item.type === "race") {
        const existingRaces = this.actor.items.filter(i => i.type === "race");
        if (existingRaces.length >= 1) {
          ui.notifications.error(game.i18n.localize("IKRPG.Character.Error.RaceLimit") || "Um personagem só pode ter uma Raça.");
          return false;
        }
      }

      // 2. Limitar a no máximo 2 carreiras
      if (item.type === "career") {
        const existingCareers = this.actor.items.filter(i => i.type === "career");
        if (existingCareers.length >= 2) {
          ui.notifications.error(game.i18n.localize("IKRPG.Character.Error.CareerLimit") || "Um personagem só pode ter no máximo duas Carreiras.");
          return false;
        }
      }
      
      // 3. Limitar a no máximo 1 arquétipo
      if (item.type === "archetype") {
        const existingArchetypes = this.actor.items.filter(i => i.type === "archetype");
        if (existingArchetypes.length >= 1) {
          ui.notifications.error("Um personagem só pode ter um Arquétipo.");
          return false;
        }
      }
    }

    return super._onDropItemCreate(itemData);
  }
}
