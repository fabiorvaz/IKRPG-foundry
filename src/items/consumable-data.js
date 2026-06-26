/**
 * TypeDataModel for Consumable items.
 * Specifies the data schema associated with 'consumable' items in Foundry VTT v13.
 */
export class ConsumableData extends foundry.abstract.TypeDataModel {
  /** @override */
  static defineSchema() {
    const fields = foundry.data.fields;
    return {
      // Stable language-independent identifier
      identifier: new fields.StringField({ required: true, initial: "" }),

      // HTML field for rich-text description
      description: new fields.HTMLField({ required: true, initial: "" }),

      // Consumable classification type
      consumableType: new fields.StringField({
        required: true,
        initial: "potion",
        choices: ["potion", "elixir", "scroll", "food", "ammo", "alchemy", "other"]
      }),

      // Inventory count
      quantity: new fields.NumberField({
        required: true,
        integer: true,
        initial: 1,
        min: 0
      }),

      // Flag indicating if the consumable has multiple uses before depletion
      multipleUses: new fields.BooleanField({ required: true, initial: false }),

      // Maximum charges/uses of the item
      usesMax: new fields.NumberField({
        required: true,
        integer: true,
        initial: 1,
        min: 1
      }),

      // Price / Cost in gold
      price: new fields.NumberField({
        required: true,
        integer: false,
        initial: 0,
        min: 0
      }),

      // Weight of the item
      weight: new fields.NumberField({
        required: true,
        integer: false,
        initial: 0,
        min: 0
      })
    };
  }

  /** @override */
  prepareBaseData() {
    super.prepareBaseData();
    // Enforce that single-use items always have exactly 1 max use
    if (!this.multipleUses) {
      this.usesMax = 1;
    }
  }
}
