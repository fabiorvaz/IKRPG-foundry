export class CustomSkillsConfigApp extends FormApplication {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "ikrpg-custom-skills-config",
      title: game.i18n.localize("IKRPG.Settings.CustomSkills.Title"),
      template: "systems/ikrpg/templates/settings/custom-skills.hbs",
      width: 800,
      height: 700,
      closeOnSubmit: true,
      resizable: true,
      scrollY: [".skills-list-container"]
    });
  }

  constructor(object, options) {
    super(object, options);
    // Carrega a cópia local de perícias da configuração de mundo do Foundry VTT
    this.skills = game.settings.get("ikrpg", "customSkills") || [];
  }

  getData(options) {
    // Enriquece a lista local com o nome traduzido (caso use nameKey) ou o nome bruto
    const enrichedSkills = this.skills.map((skill, index) => {
      let displayName = "";
      if (skill.nameKey) {
        displayName = game.i18n.localize(skill.nameKey);
        // Se a tradução não existir (retornar a chave), tenta usar o nome bruto
        if (displayName === skill.nameKey) {
          displayName = skill.name || "";
        }
      } else {
        displayName = skill.name || "";
      }

      return {
        ...skill,
        index: index,
        displayName: displayName
      };
    });

    // Agrupa por categorias
    const military = enrichedSkills.filter(s => s.category === "military");
    const professional = enrichedSkills.filter(s => s.category === "professional");
    const social = enrichedSkills.filter(s => s.category === "social");

    // Mapeamento dos atributos principais para os dropdowns
    const attributes = {
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

    return {
      military,
      professional,
      social,
      attributes
    };
  }

  // Salva o estado dos campos do formulário para o array temporário em memória
  _saveLocalState(html) {
    const rows = html.find(".skill-row");
    const updatedSkills = [];
    
    rows.each((index, element) => {
      const el = $(element);
      const id = el.find(".field-id").val();
      const name = el.find(".field-name").val();
      const category = el.data("category");
      const linkedAttribute = el.find(".field-attribute").val() || "";
      const trainedOnly = el.find(".field-trained").is(":checked");
      const general = el.find(".field-general").is(":checked");
      
      const originalIndex = parseInt(el.data("index"));
      const originalSkill = this.skills[originalIndex] || {};
      
      // Reconstrói o objeto da perícia
      const skillObj = {
        ...originalSkill,
        id: id,
        name: name,
        category: category,
        linkedAttribute: category === "social" ? "" : linkedAttribute,
        trainedOnly: trainedOnly,
        general: general
      };

      // Limpa nameKey se o usuário editou o nome bruto para evitar conflito de exibição
      if (originalSkill.nameKey && originalSkill.name !== name && name !== game.i18n.localize(originalSkill.nameKey)) {
        delete skillObj.nameKey;
      }
      
      updatedSkills.push(skillObj);
    });
    
    this.skills = updatedSkills;
  }

  activateListeners(html) {
    super.activateListeners(html);

    // Botão Adicionar Perícia
    html.find(".add-skill-btn").click(event => {
      event.preventDefault();
      const category = event.currentTarget.dataset.category;
      
      // Salva o que já foi digitado nos campos
      this._saveLocalState(html);

      // Adiciona um novo objeto de perícia
      this.skills.push({
        id: `nova-pericia-${foundry.utils.randomID(4)}`,
        category: category,
        name: "",
        linkedAttribute: category === "social" ? "" : "physique",
        level: 0,
        trainedOnly: false,
        general: false
      });

      ui.notifications.info(game.i18n.localize("IKRPG.Settings.CustomSkills.AddSuccess"));
      this.render();
    });

    // Botão Excluir Perícia
    html.find(".delete-skill-btn").click(event => {
      event.preventDefault();
      const index = parseInt(event.currentTarget.dataset.index);
      
      // Salva o que foi digitado
      this._saveLocalState(html);

      // Remove a perícia do array temporário
      this.skills.splice(index, 1);

      ui.notifications.info(game.i18n.localize("IKRPG.Settings.CustomSkills.DeleteSuccess"));
      this.render();
    });

    // Botão Restaurar Padrões
    html.find(".restore-defaults-btn").click(event => {
      event.preventDefault();

      new Dialog({
        title: game.i18n.localize("IKRPG.Settings.CustomSkills.RestoreDefaults"),
        content: `<p>${game.i18n.localize("IKRPG.Settings.CustomSkills.RestoreDefaultsHint")}</p>`,
        buttons: {
          yes: {
            icon: '<i class="fas fa-undo"></i>',
            label: "Restaurar",
            callback: async () => {
              try {
                const response = await fetch("/systems/ikrpg/data/default-skills.json");
                if (response.ok) {
                  const data = await response.json();
                  if (data && data.skills) {
                    this.skills = data.skills;
                    ui.notifications.success(game.i18n.localize("IKRPG.Settings.CustomSkills.RestoreSuccess"));
                    this.render();
                  }
                }
              } catch (e) {
                console.error("IKRPG | Erro ao carregar as perícias padrão:", e);
              }
            }
          },
          cancel: {
            icon: '<i class="fas fa-times"></i>',
            label: "Cancelar"
          }
        },
        default: "cancel"
      }).render(true);
    });

    // Botão Atualizar Fichas - Propaga as perícias customizadas globais para todos os atores
    html.find(".update-sheets-btn").click(async event => {
      event.preventDefault();
      
      // Salva o estado atual da tela antes de propagar
      this._saveLocalState(html);
      const customSkills = this.skills;
      
      // Filtra todos os atores do tipo character no mundo
      const characters = game.actors.filter(a => a.type === "character");
      let updatedCount = 0;

      for (const actor of characters) {
        const actorSkills = Array.from(actor.system.skills || []);
        let changed = false;
        const newSkills = [];

        // 1. Atualiza perícias existentes no ator que ainda constam nas configurações
        for (const actorSkill of actorSkills) {
          const systemSkill = customSkills.find(s => s.id === actorSkill.id);
          if (systemSkill) {
            let attr = systemSkill.linkedAttribute;
            if (systemSkill.category === "social" && !attr) {
              attr = "intellect";
            }

            // Verifica se houve alguma alteração de propriedade para evitar atualizações redundantes
            if (
              actorSkill.trainedOnly !== !!systemSkill.trainedOnly ||
              actorSkill.general !== !!systemSkill.general ||
              actorSkill.category !== systemSkill.category ||
              actorSkill.linkedAttribute !== attr
            ) {
              actorSkill.trainedOnly = !!systemSkill.trainedOnly;
              actorSkill.general = !!systemSkill.general;
              actorSkill.category = systemSkill.category;
              actorSkill.linkedAttribute = attr;
              changed = true;
            }
            newSkills.push(actorSkill);
          } else {
            // Mantém perícias antigas/deletadas na ficha como "Desconhecida" para não apagar dados do jogador
            newSkills.push(actorSkill);
          }
        }

        // 2. Adiciona perícias novas das configurações mundiais que o ator ainda não tem
        for (const systemSkill of customSkills) {
          const exists = newSkills.some(s => s.id === systemSkill.id);
          if (!exists) {
            let attr = systemSkill.linkedAttribute;
            if (systemSkill.category === "social" && !attr) {
              attr = "intellect";
            }

            newSkills.push({
              id: systemSkill.id,
              name: systemSkill.name || "",
              nameKey: systemSkill.nameKey || "",
              category: systemSkill.category || "professional",
              linkedAttribute: attr || "physique",
              level: 0,
              trainedOnly: !!systemSkill.trainedOnly,
              general: !!systemSkill.general
            });
            changed = true;
          }
        }

        if (changed) {
          await actor.update({ "system.skills": newSkills });
          updatedCount++;
        }
      }

      ui.notifications.info(`Fichas atualizadas com sucesso! ${updatedCount} personagens modificados.`);
    });
  }

  // Método chamado ao clicar em Salvar / Submeter o formulário
  async _updateObject(event, formData) {
    // Salva o estado atual da tela antes de atualizar as configurações do Foundry
    this._saveLocalState(this.element);

    // Salva a lista de perícias modificadas nas configurações globais do mundo
    await game.settings.set("ikrpg", "customSkills", this.skills);
    ui.notifications.success(game.i18n.localize("IKRPG.Settings.CustomSkills.NotifySave"));
  }
}
