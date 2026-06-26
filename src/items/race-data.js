/**
 * Modelo de Dados de Tipo (TypeDataModel) para Raças (Races).
 * Especifica os campos de dados associados ao tipo de item 'race' no Foundry VTT v13.
 */
export class RaceData extends foundry.abstract.TypeDataModel {
  /** @override */
  static defineSchema() {
    const fields = foundry.data.fields;

    // Helper para gerar o esquema de atributos primários
    const statsSchema = () => new fields.SchemaField({
      physique: new fields.NumberField({ required: true, integer: true, initial: 0, min: 0 }),
      strength: new fields.NumberField({ required: true, integer: true, initial: 0, min: 0 }),
      speed: new fields.NumberField({ required: true, integer: true, initial: 0, min: 0 }),
      agility: new fields.NumberField({ required: true, integer: true, initial: 0, min: 0 }),
      dexterity: new fields.NumberField({ required: true, integer: true, initial: 0, min: 0 }),
      mastery: new fields.NumberField({ required: true, integer: true, initial: 0, min: 0 }),
      intellect: new fields.NumberField({ required: true, integer: true, initial: 0, min: 0 }),
      arcana: new fields.NumberField({ required: true, integer: true, initial: 0, min: 0 }),
      perception: new fields.NumberField({ required: true, integer: true, initial: 0, min: 0 })
    });

    return {
      // Identificador estável para fins de referência interna (ex: "human")
      identifier: new fields.StringField({ required: true, initial: "" }),

      // Tamanho da raça (ex: pequeno, médio, grande)
      size: new fields.StringField({
        required: true,
        initial: "medium",
        choices: ["small", "medium", "large"]
      }),

      // Flag que indica se a raça permite ter e conjurar magia (atribute Arcana)
      allowArcane: new fields.BooleanField({ required: true, initial: true }),

      // Atributos primários iniciais (Base) da raça
      baseStats: statsSchema(),

      // Atributos primários máximos por estágio (Heróico, Veterano, Épico)
      maxStats: new fields.SchemaField({
        heroic: statsSchema(),
        veteran: statsSchema(),
        epic: statsSchema()
      }),

      // Lista de identificadores de habilidades raciais herdadas
      abilities: new fields.ArrayField(new fields.StringField(), { required: true, initial: [] }),

      // Notas, lore e descrição detalhada da raça (Editor HTML)
      description: new fields.HTMLField({ required: true, initial: "" })
    };
  }
}
