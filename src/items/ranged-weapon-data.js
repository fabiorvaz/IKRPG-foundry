/**
 * Modelo de Dados de Tipo (TypeDataModel) para Armas à Distância (Ranged Weapons).
 * Especifica os campos de dados associados ao tipo de item 'rangedWeapon' no Foundry VTT v13.
 */
export class RangedWeaponData extends foundry.abstract.TypeDataModel {
  /** @override */
  static defineSchema() {
    const fields = foundry.data.fields;
    return {
      // Identificador estável para fins de mekanika e referências internas
      identifier: new fields.StringField({ required: true, initial: "" }),

      // Identificador da perícia militar necessária (ex: "pistol", "rifle")
      militarySkill: new fields.StringField({ required: true, initial: "pistol" }),

      // Modificador de acerto / ataque inerente da arma (ex: -1, 0, +1)
      attackModifier: new fields.NumberField({ required: true, integer: true, initial: 0 }),

      // Poder base da arma à distância (dano)
      power: new fields.NumberField({ required: true, integer: true, initial: 0, min: 0 }),

      // Alcance efetivo da arma (RNG em polegadas)
      range: new fields.NumberField({ required: true, integer: true, initial: 10, min: 0 }),

      // Categoria de munição que a arma consome (ex: "light-ammo")
      ammunitionType: new fields.StringField({ required: true, initial: "" }),

      // Capacidade máxima de munição carregada
      ammoCapacity: new fields.NumberField({ required: true, integer: true, initial: 0, min: 0 }),

      // Munição atualmente carregada
      ammoCurrent: new fields.NumberField({ required: true, integer: true, initial: 0, min: 0 }),

      // Se a arma está equipada/ativa no personagem
      equipped: new fields.BooleanField({ required: true, initial: false }),

      // Notas, lore e descrição detalhada da arma (Editor HTML)
      description: new fields.HTMLField({ required: true, initial: "" })
    };
  }
}
