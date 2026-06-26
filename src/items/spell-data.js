/**
 * Modelo de Dados de Tipo (TypeDataModel) para Magias (Spells).
 * Especifica os campos de dados associados ao tipo de item 'spell' no Foundry VTT v13.
 */
export class SpellData extends foundry.abstract.TypeDataModel {
  /** @override */
  static defineSchema() {
    const fields = foundry.data.fields;
    return {
      // Identificador estável para fins de referências internas
      identifier: new fields.StringField({ required: true, initial: "" }),

      // Custo de foco/fadiga para conjurar a magia
      cost: new fields.NumberField({ required: true, integer: true, initial: 1, min: 0 }),

      // Alcance efetivo da magia (ex: "10", "Self", "CTRL", "Touch")
      range: new fields.StringField({ required: true, initial: "10" }),

      // Poder base da magia (POW) para magias ofensivas
      power: new fields.NumberField({ required: true, integer: true, initial: 0, min: 0 }),

      // Se a magia é ofensiva (requer rolagens)
      offensive: new fields.BooleanField({ required: true, initial: false }),

      // Se a magia exige manutenção ativa (Upkeep)
      maintenance: new fields.BooleanField({ required: true, initial: false }),

      // Notas, regras e descrição detalhada da magia (Editor HTML)
      description: new fields.HTMLField({ required: true, initial: "" })
    };
  }
}
