/**
 * TypeDataModel for Career items.
 * Specifies the data schema associated with 'career' items in Foundry VTT v13.
 */
export class CareerData extends foundry.abstract.TypeDataModel {
  /** @override */
  static defineSchema() {
    const fields = foundry.data.fields;

    // Helper for skill items schema
    const skillSchema = () => new fields.SchemaField({
      id: new fields.StringField({ required: true, initial: "" }),
      name: new fields.StringField({ required: true, initial: "" }),
      levelInitial: new fields.NumberField({ required: true, integer: true, initial: 0, min: 0 }),
      levelMax: new fields.NumberField({ required: true, integer: true, initial: 1, min: 0 })
    });

    // Helper for simple identifier+name lists (abilities, spells)
    const referenceSchema = () => new fields.SchemaField({
      id: new fields.StringField({ required: true, initial: "" }),
      name: new fields.StringField({ required: true, initial: "" })
    });

    return {
      // Every item should define a stable, language-independent identifier
      identifier: new fields.StringField({ required: true, initial: "" }),

      // Gold/assets description
      startingCapital: new fields.StringField({ required: true, initial: "" }),

      // Flag indicating if the career possesses spells
      hasSpells: new fields.BooleanField({ required: true, initial: false }),

      // Military skills list
      militarySkills: new fields.ArrayField(skillSchema(), { required: true, initial: [] }),

      // Social skills list
      socialSkills: new fields.ArrayField(skillSchema(), { required: true, initial: [] }),

      // Career/General/Professional skills list
      careerSkills: new fields.ArrayField(skillSchema(), { required: true, initial: [] }),

      // Starting abilities list
      startingAbilities: new fields.ArrayField(referenceSchema(), { required: true, initial: [] }),

      // Career abilities list (available for progression)
      careerAbilities: new fields.ArrayField(referenceSchema(), { required: true, initial: [] }),

      // Starting spells list
      startingSpells: new fields.ArrayField(referenceSchema(), { required: true, initial: [] }),

      // Career spells list (available for progression)
      careerSpells: new fields.ArrayField(referenceSchema(), { required: true, initial: [] }),

      // Starting items description list
      startingItems: new fields.ArrayField(new fields.StringField(), { required: true, initial: [] }),

      // Rich-text description/notes
      description: new fields.HTMLField({ required: true, initial: "" }),

      // Rich-text "playing style" summary
      playstyle: new fields.HTMLField({ required: true, initial: "" })
    };
  }
}
