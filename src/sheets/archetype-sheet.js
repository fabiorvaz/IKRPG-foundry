/**
 * Classe da Ficha de Item para Arquétipos (Archetype Sheet).
 * Define a lógica de visualização e manipulação do formulário da ficha de item de arquétipo.
 */
export class IKRPGArchetypeSheet extends ItemSheet {
  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["ikrpg", "sheet", "item", "archetype"],
      width: 550,
      height: 480,
      tabs: [{
        navSelector: ".sheet-tabs",
        contentSelector: ".sheet-body",
        initial: "properties"
      }]
    });
  }

  /** @override */
  get template() {
    return "systems/ikrpg/templates/items/archetype-sheet.hbs";
  }

  /** @override */
  getData(options) {
    const context = super.getData(options);
    
    // Facilitador para acessar os dados do schema diretamente no template
    context.system = this.item.system;

    return context;
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Botão Adicionar Habilidade (Adiciona um input de identificador)
    html.find(".add-ability-btn").click(async (event) => {
      event.preventDefault();
      const abilities = Array.from(this.item.system.abilities || []);
      abilities.push(""); // Adiciona um campo em branco
      await this._onSubmit(event, { updateData: { "system.abilities": abilities } });
    });

    // Botão Remover Habilidade (Remove um input de identificador)
    html.find(".delete-ability-btn").click(async (event) => {
      event.preventDefault();
      const index = parseInt(event.currentTarget.dataset.index);
      const abilities = Array.from(this.item.system.abilities || []);
      abilities.splice(index, 1);
      await this._onSubmit(event, { updateData: { "system.abilities": abilities } });
    });
  }
}
