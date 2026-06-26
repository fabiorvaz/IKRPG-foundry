/**
 * Sheet class for Consumable items.
 * Manages view options, templates, and data context for rendering the sheet.
 */
export class IKRPGConsumableSheet extends ItemSheet {
  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["ikrpg", "sheet", "item", "consumable"],
      width: 550,
      height: 460,
      tabs: [{
        navSelector: ".sheet-tabs",
        contentSelector: ".sheet-body",
        initial: "properties"
      }]
    });
  }

  /** @override */
  get template() {
    return "systems/ikrpg/templates/items/consumable-sheet.hbs";
  }

  /** @override */
  getData(options) {
    const context = super.getData(options);
    
    // Provide direct reference to system fields for easier template access
    context.system = this.item.system;

    // Prepare localized choices for consumable types
    context.consumableTypes = {
      "potion": game.i18n.localize("IKRPG.Consumable.TypePotion") || "Poção",
      "elixir": game.i18n.localize("IKRPG.Consumable.TypeElixir") || "Elixir",
      "scroll": game.i18n.localize("IKRPG.Consumable.TypeScroll") || "Pergaminho",
      "food": game.i18n.localize("IKRPG.Consumable.TypeFood") || "Alimento/Ração",
      "ammo": game.i18n.localize("IKRPG.Consumable.TypeAmmo") || "Munição",
      "alchemy": game.i18n.localize("IKRPG.Consumable.TypeAlchemy") || "Alquímico",
      "other": game.i18n.localize("IKRPG.Consumable.TypeOther") || "Outro"
    };

    return context;
  }
}
