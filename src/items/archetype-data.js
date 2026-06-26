/**
 * Modelo de Dados de Tipo (TypeDataModel) para Arquétipos (Archetypes).
 * Especifica os campos de dados associados ao tipo de item 'archetype' no Foundry VTT v13.
 */
export class ArchetypeData extends foundry.abstract.TypeDataModel {
  /** @override */
  static defineSchema() {
    const fields = foundry.data.fields;
    return {
      // Identificador estável para fins de referência interna (ex: "gifted")
      identifier: new fields.StringField({ required: true, initial: "" }),

      // Nome do Tipo de Arquétipo (ex: Conjurador, Intelectual, Poderoso, Habilidoso)
      archetypeType: new fields.StringField({ required: true, initial: "" }),

      // Benefício inicial do arquétipo
      startingBenefit: new fields.StringField({ required: true, initial: "" }),

      // Lista de identificadores de habilidades associadas a este arquétipo
      abilities: new fields.ArrayField(new fields.StringField(), { required: true, initial: [] }),

      // Descrição detalhada e benefícios do arquétipo
      description: new fields.HTMLField({ required: true, initial: "" })
    };
  }
}
