/**
 * Modelo de Dados de Tipo (TypeDataModel) para Personagem do Jogador (Player Character).
 * Especifica os campos de dados associados ao tipo de ator 'character' no Foundry VTT v13.
 */
export class CharacterData extends foundry.abstract.TypeDataModel {
  /** @override */
  static defineSchema() {
    const fields = foundry.data.fields;

    // Helper para gerar o esquema de atributos primários
    const attributeField = () => new fields.SchemaField({
      value: new fields.NumberField({ required: true, integer: true, initial: 0, min: 0 }),
      available: new fields.BooleanField({ required: true, initial: true })
    });

    // Helper para gerar o esquema de perícias
    const skillSchema = () => new fields.SchemaField({
      id: new fields.StringField({ required: true, initial: "" }),
      name: new fields.StringField({ required: true, initial: "" }),
      nameKey: new fields.StringField({ required: false, initial: "" }),
      category: new fields.StringField({ required: true, initial: "professional", choices: ["military", "professional", "social"] }),
      linkedAttribute: new fields.StringField({ required: true, initial: "physique" }),
      level: new fields.NumberField({ required: true, integer: true, initial: 0, min: 0 }),
      trainedOnly: new fields.BooleanField({ required: true, initial: false }),
      general: new fields.BooleanField({ required: true, initial: false })
    });

    return {
      // Atributos Primários
      attributes: new fields.SchemaField({
        physique: attributeField(),
        strength: attributeField(),
        speed: attributeField(),
        agility: attributeField(),
        dexterity: attributeField(),
        mastery: attributeField(),
        intellect: attributeField(),
        arcana: attributeField(),
        perception: attributeField()
      }),

      // Perícias do personagem
      skills: new fields.ArrayField(skillSchema(), { required: true, initial: [] }),

      // Pontos de Façanha (0 a 3)
      featPoints: new fields.NumberField({ required: true, integer: true, initial: 0, min: 0, max: 3 }),

      // Dano na Espiral Vital
      vitalSpiral: new fields.SchemaField({
        physique1: new fields.NumberField({ required: true, integer: true, initial: 0, min: 0 }),
        physique2: new fields.NumberField({ required: true, integer: true, initial: 0, min: 0 }),
        agility1: new fields.NumberField({ required: true, integer: true, initial: 0, min: 0 }),
        agility2: new fields.NumberField({ required: true, integer: true, initial: 0, min: 0 }),
        intellect1: new fields.NumberField({ required: true, integer: true, initial: 0, min: 0 }),
        intellect2: new fields.NumberField({ required: true, integer: true, initial: 0, min: 0 })
      }),

      // Campo de Força
      forceField: new fields.SchemaField({
        enabled: new fields.BooleanField({ required: true, initial: false }),
        damage: new fields.NumberField({ required: true, integer: true, initial: 0, min: 0, max: 6 })
      }),

      // Experiência e Categoria
      xp: new fields.NumberField({ required: true, integer: true, initial: 0, min: 0 }),
      tier: new fields.StringField({ required: true, initial: "heroic", choices: ["heroic", "veteran", "epic"] }),

      // Dados Biográficos
      religion: new fields.StringField({ required: true, initial: "" }),
      height: new fields.StringField({ required: true, initial: "" }),
      weight: new fields.StringField({ required: true, initial: "" }),
      age: new fields.StringField({ required: true, initial: "" }),
      languages: new fields.StringField({ required: true, initial: "" }),
      connections: new fields.StringField({ required: true, initial: "" }),

      // Rich text
      description: new fields.HTMLField({ required: true, initial: "" }), // História
      notes: new fields.HTMLField({ required: true, initial: "" })       // Notas Gerais
    };
  }

  /** @override */
  prepareDerivedData() {
    super.prepareDerivedData();

    // 1. Acumular modificadores de armaduras e escudos equipados
    let armorMod = 0;
    let defMod = 0;
    let spdMod = 0;

    if (this.parent && this.parent.items) {
      for (const item of this.parent.items) {
        if (item.type === "armor" && item.system.equipped) {
          armorMod += item.system.armorModifier || 0;
          defMod += item.system.defenseModifier || 0;
          spdMod += item.system.speedModifier || 0;
        }
      }
    }

    // 2. Vontade (Willpower): Físico + Intelecto
    const physique = this.attributes.physique.value || 0;
    const intellect = this.attributes.intellect.value || 0;
    this.willpower = physique + intellect;

    // 3. Velocidade efetiva (considerando penalidades de armadura)
    const speed = this.attributes.speed.value || 0;
    const effectiveSpeed = Math.max(0, speed + spdMod);

    // 4. Defesa (Defense): Velocidade + Agilidade + Percepção + Modificadores de Equipamento
    const agility = this.attributes.agility.value || 0;
    const perception = this.attributes.perception.value || 0;
    this.defense = effectiveSpeed + agility + perception + defMod;

    // 5. Armadura (Armor): Físico + Modificadores de Equipamento
    this.armor = physique + armorMod;

    // 6. Iniciativa (Initiative): Velocidade + Maestria + Percepção (Usa velocidade efetiva)
    const mastery = this.attributes.mastery.value || 0;
    this.initiative = effectiveSpeed + mastery + perception;

    // 7. Alcance de Comando (Command Range): Intelecto + Nível de Perícia Liderança/Command
    const commandSkill = this.skills.find(s => s.id === "command" || s.id === "lideranca");
    const commandLevel = commandSkill ? (commandSkill.level || 0) : 0;
    this.commandRange = intellect + commandLevel;
  }
}
