/**
 * Classe da Ficha de Item para Armas Corpo a Corpo (Melee Weapon Sheet).
 * Define a lógica de visualização e manipulação do formulário da ficha de item.
 */
export class IKRPGMeleeWeaponSheet extends ItemSheet {
  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["ikrpg", "sheet", "item", "melee-weapon"],
      width: 550,
      height: 420,
      tabs: [{
        navSelector: ".sheet-tabs",
        contentSelector: ".sheet-body",
        initial: "properties"
      }]
    });
  }

  /** @override */
  get template() {
    return "systems/ikrpg/templates/items/melee-weapon-sheet.hbs";
  }

  /** @override */
  getData(options) {
    const context = super.getData(options);
    
    // Facilitador para acessar os dados do schema diretamente no template
    context.system = this.item.system;

    // Obter perícias militares configuradas no mundo
    const allSkills = game.settings.get("ikrpg", "customSkills") || [];
    const militarySkills = allSkills
      .filter(s => s.category === "military")
      .map(s => {
        let displayName = s.nameKey ? game.i18n.localize(s.nameKey) : s.name;
        // Fallback caso a chave de tradução não exista ou retorne a própria chave
        if (displayName === s.nameKey) {
          displayName = s.name || s.id;
        }
        return {
          id: s.id,
          name: displayName
        };
      });

    // Adiciona ao contexto para popular o dropdown de perícia militar
    context.militarySkills = militarySkills;

    return context;
  }
}
