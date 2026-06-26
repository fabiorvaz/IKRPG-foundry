/**
 * TypeDataModel for Miscellaneous items.
 * Specifies the data schema associated with 'miscellaneous' items in Foundry VTT v13.
 */
export class MiscellaneousData extends foundry.abstract.TypeDataModel {
  /** @override */
  static defineSchema() {
    const fields = foundry.data.fields;
    return {
      // Stable language-independent identifier
      identifier: new fields.StringField({ required: true, initial: "" }),

      // HTML field for rich-text description
      description: new fields.HTMLField({ required: true, initial: "" }),

      // Miscellaneous categorization/type
      itemType: new fields.StringField({
        required: true,
        initial: "general",
        choices: ["general", "tool", "valuable", "container", "other"]
      }),

      // Inventory count
      quantity: new fields.NumberField({
        required: true,
        integer: true,
        initial: 1,
        min: 0
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
}
