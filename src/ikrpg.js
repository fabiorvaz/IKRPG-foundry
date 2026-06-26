import { CustomSkillsConfigApp } from "./settings/settings-config.js";
import { RangedWeaponData } from "./items/ranged-weapon-data.js";
import { IKRPGRangedWeaponSheet } from "./sheets/ranged-weapon-sheet.js";
import { MeleeWeaponData } from "./items/melee-weapon-data.js";
import { IKRPGMeleeWeaponSheet } from "./sheets/melee-weapon-sheet.js";

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
