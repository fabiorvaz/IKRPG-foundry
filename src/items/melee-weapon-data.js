/**
 * Modelo de Dados de Tipo (TypeDataModel) para Armas Corpo a Corpo (Melee Weapons).
 * Especifica os campos de dados associados ao tipo de item 'meleeWeapon' no Foundry VTT v13.
 */
export class MeleeWeaponData extends foundry.abstract.TypeDataModel {
  /** @override */
  static defineSchema() {
    const fields = foundry.data.fields;
    return {
      // Identificador estável para fins de mekanika e referências internas
      identifier: new fields.StringField({ required: true, initial: "" }),

      // Identificador da perícia militar necessária (ex: "unarmed", "hand-weapon", "great-weapon")
      militarySkill: new fields.StringField({ required: true, initial: "" }),

      // Modificador de acerto / ataque inerente da arma (ex: -1, 0, +1)
      attackModifier: new fields.NumberField({ required: true, integer: true, initial: 0 }),

      // Poder base da arma corpo a corpo (dano)
      power: new fields.NumberField({ required: true, integer: true, initial: 0, min: 0 }),

      // Se a arma está equipada/ativa no personagem
      equipped: new fields.BooleanField({ required: true, initial: false }),

      // Notas, lore e descrição detalhada da arma (Editor HTML)
      description: new fields.HTMLField({ required: true, initial: "" })
    };
  }
}
