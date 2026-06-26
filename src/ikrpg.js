import { CustomSkillsConfigApp } from "./settings/settings-config.js";
import { RangedWeaponData } from "./items/ranged-weapon-data.js";
import { IKRPGRangedWeaponSheet } from "./sheets/ranged-weapon-sheet.js";
import { MeleeWeaponData } from "./items/melee-weapon-data.js";
import { IKRPGMeleeWeaponSheet } from "./sheets/melee-weapon-sheet.js";
import { AbilityData } from "./items/ability-data.js";
import { IKRPGAbilitySheet } from "./sheets/ability-sheet.js";
import { SpellData } from "./items/spell-data.js";
import { IKRPGSpellSheet } from "./sheets/spell-sheet.js";
import { ArmorData } from "./items/armor-data.js";
import { IKRPGArmorSheet } from "./sheets/armor-sheet.js";
import { ConsumableData } from "./items/consumable-data.js";
import { IKRPGConsumableSheet } from "./sheets/consumable-sheet.js";
import { MiscellaneousData } from "./items/miscellaneous-data.js";
import { IKRPGMiscellaneousSheet } from "./sheets/miscellaneous-sheet.js";
import { ArchetypeData } from "./items/archetype-data.js";
import { IKRPGArchetypeSheet } from "./sheets/archetype-sheet.js";
import { RaceData } from "./items/race-data.js";
import { IKRPGRaceSheet } from "./sheets/race-sheet.js";
import { CareerData } from "./items/career-data.js";
import { IKRPGCareerSheet } from "./sheets/career-sheet.js";
import { CharacterData } from "./actors/character-data.js";
import { IKRPGCharacterSheet } from "./sheets/character-sheet.js";

// Helper para obter os idiomas disponíveis no manifesto do sistema
function getAvailableLanguages() {
  const choices = {};
  if (game.system && game.system.languages) {
    for (let l of game.system.languages) {
      choices[l.lang] = l.name;
    }
  } else {
    // Fallback estático caso o sistema ainda não esteja totalmente instanciado
    choices["pt-br"] = "Português (Brasil)";
  }
  return choices;
}

// Determinar o idioma padrão conforme as regras do usuário:
// 1. O mesmo do Foundry, se disponível
// 2. Senão, Inglês ("en")
// 3. Senão, o primeiro arquivo de tradução que encontrar
function determineDefaultLanguage(choices) {
  let foundryLang = null;
  try {
    foundryLang = game.settings.get("core", "language");
  } catch (e) {
    foundryLang = game.i18n?.lang;
  }

  if (foundryLang && choices[foundryLang]) {
    return foundryLang;
  }

  if (choices["en"]) {
    return "en";
  }

  const keys = Object.keys(choices);
  if (keys.length > 0) {
    return keys[0];
  }

  return "pt-br"; // Fallback rígido de segurança
}

Hooks.once("init", () => {
  console.log("IKRPG | Inicializando o Sistema Iron Kingdoms RPG...");

  // Registrar Modelos de Dados de Itens (DataModels)
  CONFIG.Item.dataModels = CONFIG.Item.dataModels || {};
  CONFIG.Item.dataModels.rangedWeapon = RangedWeaponData;
  CONFIG.Item.dataModels.meleeWeapon = MeleeWeaponData;
  CONFIG.Item.dataModels.ability = AbilityData;
  CONFIG.Item.dataModels.spell = SpellData;
  CONFIG.Item.dataModels.armor = ArmorData;
  CONFIG.Item.dataModels.consumable = ConsumableData;
  CONFIG.Item.dataModels.miscellaneous = MiscellaneousData;
  CONFIG.Item.dataModels.archetype = ArchetypeData;
  CONFIG.Item.dataModels.race = RaceData;
  CONFIG.Item.dataModels.career = CareerData;

  // Registrar Modelos de Dados de Atores (DataModels)
  CONFIG.Actor.dataModels = CONFIG.Actor.dataModels || {};
  CONFIG.Actor.dataModels.character = CharacterData;

  // Registrar Fichas de Itens
  Items.registerSheet("ikrpg", IKRPGRangedWeaponSheet, {
    types: ["rangedWeapon"],
    makeDefault: true,
    label: "IKRPG.Weapon.RangedSheet"
  });

  Items.registerSheet("ikrpg", IKRPGMeleeWeaponSheet, {
    types: ["meleeWeapon"],
    makeDefault: true,
    label: "IKRPG.Weapon.MeleeSheet"
  });

  Items.registerSheet("ikrpg", IKRPGAbilitySheet, {
    types: ["ability"],
    makeDefault: true,
    label: "IKRPG.Ability.SheetName"
  });

  Items.registerSheet("ikrpg", IKRPGSpellSheet, {
    types: ["spell"],
    makeDefault: true,
    label: "IKRPG.Spell.SheetName"
  });

  Items.registerSheet("ikrpg", IKRPGArmorSheet, {
    types: ["armor"],
    makeDefault: true,
    label: "IKRPG.Armor.SheetName"
  });

  Items.registerSheet("ikrpg", IKRPGConsumableSheet, {
    types: ["consumable"],
    makeDefault: true,
    label: "IKRPG.Consumable.SheetName"
  });

  Items.registerSheet("ikrpg", IKRPGMiscellaneousSheet, {
    types: ["miscellaneous"],
    makeDefault: true,
    label: "IKRPG.Miscellaneous.SheetName"
  });

  Items.registerSheet("ikrpg", IKRPGArchetypeSheet, {
    types: ["archetype"],
    makeDefault: true,
    label: "IKRPG.Archetype.SheetName"
  });

  Items.registerSheet("ikrpg", IKRPGRaceSheet, {
    types: ["race"],
    makeDefault: true,
    label: "IKRPG.Race.SheetName"
  });

  Items.registerSheet("ikrpg", IKRPGCareerSheet, {
    types: ["career"],
    makeDefault: true,
    label: "IKRPG.Career.SheetName"
  });

  Actors.registerSheet("ikrpg", IKRPGCharacterSheet, {
    types: ["character"],
    makeDefault: true,
    label: "IKRPG.Character.SheetName"
  });

  const langs = getAvailableLanguages();
  const defaultLang = determineDefaultLanguage(langs);

  // Registrar seletor de idioma padrão (Mundo)
  game.settings.register("ikrpg", "defaultLanguage", {
    name: "IKRPG.Settings.DefaultLanguage.Name",
    hint: "IKRPG.Settings.DefaultLanguage.Hint",
    scope: "world",
    config: true,
    type: String,
    choices: langs,
    default: defaultLang,
    onChange: (value) => {
      console.log(`IKRPG | Idioma padrão alterado para: ${value}`);
    }
  });

  // Registrar menu que abre a janela de configuração de perícias
  game.settings.registerMenu("ikrpg", "customSkillsMenu", {
    name: "IKRPG.Settings.CustomSkillsMenu.Name",
    label: "IKRPG.Settings.CustomSkillsMenu.Label",
    hint: "IKRPG.Settings.CustomSkillsMenu.Hint",
    icon: "fas fa-user-cog",
    type: CustomSkillsConfigApp,
    restricted: true
  });

  // Registrar configuração interna que armazena a lista de perícias customizadas
  game.settings.register("ikrpg", "customSkills", {
    name: "Custom Skills List",
    scope: "world",
    config: false,
    type: Array,
    default: []
  });
});

Hooks.on("ready", async () => {
  // Carregar lista padrão caso a configuração do mundo esteja vazia
  const currentSkills = game.settings.get("ikrpg", "customSkills");
  if (!currentSkills || currentSkills.length === 0) {
    console.log("IKRPG | Nenhuma perícia configurada. Carregando padrão de default-skills.json...");
    try {
      const response = await fetch("/systems/ikrpg/data/default-skills.json");
      if (response.ok) {
        const data = await response.json();
        if (data && data.skills) {
          await game.settings.set("ikrpg", "customSkills", data.skills);
          console.log("IKRPG | Perícias iniciais do mundo carregadas com sucesso!");
        }
      } else {
        console.error(`IKRPG | Falha ao ler default-skills.json: HTTP ${response.status}`);
      }
    } catch (e) {
      console.error("IKRPG | Erro na carga inicial das perícias padrões:", e);
    }
  }
});

// Hook para inicializar a lista de perícias padrões no momento da criação do personagem
Hooks.on("preCreateActor", (actor, data, options, userId) => {
  if (actor.type !== "character") return;

  const defaultSkills = game.settings.get("ikrpg", "customSkills") || [];
  const skills = defaultSkills.map(skill => {
    // Definir atributo inicial da perícia. Para perícias sociais, o padrão é intellect (Intelecto).
    let attr = skill.linkedAttribute || "physique";
    if (skill.category === "social") {
      attr = "intellect";
    }

    return {
      id: skill.id,
      name: skill.name || "",
      nameKey: skill.nameKey || "",
      category: skill.category || "professional",
      linkedAttribute: attr,
      level: 0,
      trainedOnly: !!skill.trainedOnly,
      general: !!skill.general
    };
  });

  actor.updateSource({ "system.skills": skills });
});

// Hook para processar as importações de Raça e Carreira no ator de personagem
Hooks.on("createItem", async (item, options, userId) => {
  // Executar apenas para o cliente do próprio criador para evitar concorrência
  if (game.user.id !== userId) return;

  const actor = item.actor;
  if (!actor || actor.type !== "character") return;

  if (item.type === "race") {
    const baseStats = item.system.baseStats;
    if (baseStats) {
      const updates = {};
      for (const [stat, val] of Object.entries(baseStats)) {
        updates[`system.attributes.${stat}.value`] = val;
      }
      updates["system.attributes.arcana.available"] = item.system.allowArcane;
      await actor.update(updates);
    }
  } else if (item.type === "career") {
    const actorSkills = Array.from(actor.system.skills || []);
    let changed = false;

    const mergeSkills = (careerSkills, defaultCategory) => {
      if (!careerSkills) return;
      const allSkills = game.settings.get("ikrpg", "customSkills") || [];

      for (const cs of careerSkills) {
        if (!cs.id) continue;
        const existing = actorSkills.find(s => s.id === cs.id);
        if (existing) {
          if (existing.level < cs.levelInitial) {
            existing.level = cs.levelInitial;
            changed = true;
          }
        } else {
          // Perícia não existente na ficha, tenta buscar nas configurações do sistema
          const systemSkill = allSkills.find(s => s.id === cs.id);
          const category = systemSkill?.category || defaultCategory || "professional";
          
          let attr = systemSkill?.linkedAttribute || "physique";
          if (category === "social") {
            attr = "intellect";
          }

          let name = cs.name || "";
          let nameKey = "";
          if (systemSkill) {
            nameKey = systemSkill.nameKey || "";
            if (nameKey) {
              const localized = game.i18n.localize(nameKey);
              name = localized !== nameKey ? localized : (systemSkill.name || cs.name || cs.id);
            } else {
              name = systemSkill.name || cs.name || cs.id;
            }
          }

          actorSkills.push({
            id: cs.id,
            name: name,
            nameKey: nameKey,
            category: category,
            linkedAttribute: attr,
            level: cs.levelInitial,
            trainedOnly: systemSkill ? !!systemSkill.trainedOnly : false,
            general: systemSkill ? !!systemSkill.general : false
          });
          changed = true;
        }
      }
    };

    mergeSkills(item.system.militarySkills, "military");
    mergeSkills(item.system.socialSkills, "social");
    mergeSkills(item.system.careerSkills, "professional");

    if (changed) {
      await actor.update({ "system.skills": actorSkills });
    }
  }
});
