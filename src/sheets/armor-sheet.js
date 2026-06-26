/**
 * Sheet class for Armor items.
 * Manages view options, templates, and data context for rendering the sheet.
 */
export class IKRPGArmorSheet extends ItemSheet {
  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      // Must include 'ikrpg', 'sheet', 'item' and the kebab-cased sheet type identifier
      classes: ["ikrpg", "sheet", "item", "armor"],
      width: 550,
      height: 450,
      tabs: [{
        navSelector: ".sheet-tabs",
        contentSelector: ".sheet-body",
        initial: "properties"
      }]
    });
  }

  /** @override */
  get template() {
    return "systems/ikrpg/templates/items/armor-sheet.hbs";
  }

  /** @override */
  getData(options) {
    const context = super.getData(options);
    
    // Provide direct reference to system fields for easier template access
    context.system = this.item.system;

    // Prepare localized choices for armor types
    context.armorTypes = {
      "armor": game.i18n.localize("IKRPG.Armor.TypeArmor") || "Armadura",
      "shield": game.i18n.localize("IKRPG.Armor.TypeShield") || "Escudo"
    };

    // Prepare localized choices for armor variants
    context.variants = {
      "light": game.i18n.localize("IKRPG.Armor.VariantLight") || "Leve",
      "medium": game.i18n.localize("IKRPG.Armor.VariantMedium") || "Média",
      "heavy": game.i18n.localize("IKRPG.Armor.VariantHeavy") || "Pesada",
      "none": game.i18n.localize("IKRPG.Armor.VariantNone") || "Nenhuma (Escudo)"
    };

    return context;
  }
}
