/**
 * Modelo de Dados de Tipo (TypeDataModel) para Habilidades (Abilities).
 * Especifica os campos de dados associados ao tipo de item 'ability' no Foundry VTT v13.
 */
export class AbilityData extends foundry.abstract.TypeDataModel {
  /** @override */
  static defineSchema() {
    const fields = foundry.data.fields;
    return {
      // Identificador estável para fins de referência interna (ex: "sentry")
      identifier: new fields.StringField({ required: true, initial: "" }),

      // Categoria da habilidade (arquétipo, carreira, geral, outra)
      abilityType: new fields.StringField({
        required: true,
        initial: "general",
        choices: ["archetype", "career", "general", "other"]
      }),

      // Pré-requisitos para obter a habilidade (ex: "Arcane 4, Craft (metalworking) 1")
      prerequisite: new fields.StringField({ required: true, initial: "" }),

      // Notas, lore e descrição detalhada dos efeitos mecânicos da habilidade
      description: new fields.HTMLField({ required: true, initial: "" })
    };
  }
}
