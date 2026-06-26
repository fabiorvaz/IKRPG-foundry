/**
 * Classe da Ficha de Item para Raças (Race Sheet).
 * Define a lógica de visualização e manipulação do formulário da ficha de item de raça.
 */
export class IKRPGRaceSheet extends ItemSheet {
  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["ikrpg", "sheet", "item", "race"],
      width: 580,
      height: 600,
      tabs: [{
        navSelector: ".sheet-tabs",
        contentSelector: ".sheet-body",
        initial: "properties"
      }]
    });
  }

  /** @override */
  get template() {
    return "systems/ikrpg/templates/items/race-sheet.hbs";
  }

  /** @override */
  getData(options) {
    const context = super.getData(options);
    
    // Facilitador para acessar os dados do schema diretamente no template
    context.system = this.item.system;

    // Obter as opções de tamanho localizadas para a seleção
    context.sizes = {
      small: game.i18n.localize("IKRPG.Race.SizeSmall") || "Pequeno",
      medium: game.i18n.localize("IKRPG.Race.SizeMedium") || "Médio",
      large: game.i18n.localize("IKRPG.Race.SizeLarge") || "Grande"
    };

    return context;
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Botão Adicionar Habilidade Racial (Adiciona um input de identificador)
    html.find(".add-ability-btn").click(async (event) => {
      event.preventDefault();
      
      // Submete a ficha primeiro para garantir que nenhuma edição pendente nos inputs seja perdida
      await this._onSubmit(event);

      const abilities = Array.from(this.item.system.abilities || []);
      abilities.push(""); // Adiciona um campo em branco
      
      await this.item.update({ "system.abilities": abilities });
    });

    // Botão Remover Habilidade Racial (Remove um input de identificador)
    html.find(".delete-ability-btn").click(async (event) => {
      event.preventDefault();
      const index = parseInt(event.currentTarget.dataset.index);
      
      // Submete a ficha primeiro para salvar o estado atual
      await this._onSubmit(event);

      const abilities = Array.from(this.item.system.abilities || []);
      abilities.splice(index, 1);
      
      await this.item.update({ "system.abilities": abilities });
    });
  }
}
