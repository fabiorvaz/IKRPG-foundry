/**
 * TypeDataModel for Armor items.
 * Specifies the data schema associated with 'armor' items in Foundry VTT v13.
 */
export class ArmorData extends foundry.abstract.TypeDataModel {
  /** @override */
  static defineSchema() {
    const fields = foundry.data.fields;
    return {
      // Every item should define a stable, language-independent identifier
      identifier: new fields.StringField({ required: true, initial: "" }),

      // HTML field for rich-text description
      description: new fields.HTMLField({ required: true, initial: "" }),

      // Armor Type (Armor vs Shield)
      armorType: new fields.StringField({
        required: true,
        initial: "armor",
        choices: ["armor", "shield"]
      }),

      // Armor Variant (Light, Medium, Heavy, None)
      variant: new fields.StringField({
        required: true,
        initial: "light",
        choices: ["light", "medium", "heavy", "none"]
      }),

      // Equipped state (used on Actor sheet level)
      equipped: new fields.BooleanField({ required: true, initial: false }),

      // Armor value/modifier
      armorModifier: new fields.NumberField({
        required: true,
        integer: true,
        initial: 0
      }),

      // Defense penalty/modifier (usually 0 or negative)
      defenseModifier: new fields.NumberField({
        required: true,
        integer: true,
        initial: 0
      }),

      // Speed penalty/modifier (usually 0 or negative)
      speedModifier: new fields.NumberField({
        required: true,
        integer: true,
        initial: 0
      })
    };
  }
}
