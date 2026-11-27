import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, Shield, Sparkles, Hammer, Utensils, Compass, 
  BookOpen, ExternalLink, Key, Zap, Skull, ChevronDown, 
  HelpCircle, CheckCircle2, AlertTriangle, X, Radio, MapPin, 
  Flame, Crosshair, Package, Anchor, Moon, Layers, Info, Award,
  Globe, Cpu, Volume2, Settings, Server, Eye, Wrench
} from 'lucide-react';

// --- DATA DEFINITION ---
// Все категории и моды из гайда по сборке Minecraft (NeoForge 1.21.1)
const ROLES = [
  { id: 'all', label: 'Все', icon: Layers, color: 'from-purple-600 to-indigo-600' },
  { id: 'mage', label: 'Магия', icon: Sparkles, color: 'from-purple-600 to-fuchsia-600' },
  { id: 'engineer', label: 'Техника и Космос', icon: Hammer, color: 'from-amber-600 to-orange-600' },
  { id: 'world', label: 'Мир и Сезоны', icon: Globe, color: 'from-teal-600 to-emerald-600' },
  { id: 'monsters', label: 'Монстры и Сложность', icon: Skull, color: 'from-rose-700 to-red-600' },
  { id: 'pets', label: 'Животные и Питомцы', icon: Compass, color: 'from-lime-600 to-green-600' },
  { id: 'cook', label: 'Еда и Ферма', icon: Utensils, color: 'from-emerald-600 to-teal-600' },
  { id: 'gear', label: 'Оружие и Инвентарь', icon: Crosshair, color: 'from-red-600 to-amber-600' },
  { id: 'builder', label: 'Стройка и Декор', icon: Shield, color: 'from-blue-600 to-cyan-600' },
  { id: 'server', label: 'Сервер и Удобства', icon: Server, color: 'from-sky-600 to-indigo-600' },
  { id: 'atmosphere', label: 'Графика и Звук', icon: Volume2, color: 'from-violet-600 to-purple-600' },
  { id: 'tech', label: 'Технические и Библиотеки', icon: Cpu, color: 'from-slate-600 to-zinc-600' },
];

const MODS_DATA = [
  // ================= 1. МАГИЯ =================
  {
    id: 'ars-nouveau',
    title: 'Ars Nouveau',
    role: 'mage',
    roleLabel: 'Магия (Роль: Маг)',
    difficulty: 'Средне',
    diffColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    summary: 'Вы собираете собственные заклинания из символов-глифов. Есть ритуалы, магическая броня и помощники для автоматизации.',
    startGuide: 'Скрафтите Worn Notebook (книга + 1 лазурит): это внутриигровой учебник.',
    wikiUrl: 'https://www.arsnouveau.wiki/',
    keywords: ['магия', 'заклинания', 'глифы', 'ритуалы', 'броня', 'автоматизация', 'ars', 'nouveau'],
    details: [
      'Сборка кастомных заклинаний из символов-глифов.',
      'Включает ритуалы, магическую броню и помощников для автоматизации.',
      'Новичку проще начать с Iron\'s Spells или Ars Nouveau.'
    ]
  },
  {
    id: 'irons-spells',
    title: "Iron's Spells 'n Spellbooks",
    role: 'mage',
    roleLabel: 'Магия (Роль: Маг)',
    difficulty: 'Просто',
    diffColor: 'bg-green-500/20 text-green-400 border-green-500/30',
    summary: 'Классическая RPG-магия: готовые заклинания по школам, мана, перезарядка, маги-враги и данжи.',
    startGuide: 'Найдите свиток: он расходуется при касте. Из книги заклинаний касты тратят ману и перезаряжаются.',
    wikiUrl: 'https://iron.wiki',
    keywords: ['магия', 'заклинания', 'свитки', 'мана', 'перезарядка', 'данжи', 'rpg', 'irons'],
    details: [
      'Готовые заклинания по различным магическим школам.',
      'Система маны и перезарядки при использовании книги заклинаний; свитки тратятся при касте.',
      'В мире встречаются маги-враги и связанные данжи.'
    ]
  },
  {
    id: 'ars-n-spells',
    title: "Ars 'n' Spells",
    role: 'mage',
    roleLabel: 'Магия',
    difficulty: 'Средне',
    diffColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    summary: 'Мостик между Ars Nouveau и Iron\'s Spells: объединяет работу маны и бонусов снаряжения, позволяет переносить заклинания Ars в книги Iron\'s.',
    startGuide: 'Изучать после основ обоих модов. Правила зависят от настроек.',
    keywords: ['ars', 'irons', 'мостик', 'мана', 'снаряжение', 'заклинания'],
    details: [
      'Объединяет работу маны и бонусов снаряжения двух магических модов.',
      'Позволяет переносить заклинания Ars Nouveau в книги Iron\'s Spells.',
      'Конкретные правила зависят от настроек сборки.'
    ]
  },
  {
    id: 'occultism',
    title: 'Occultism',
    role: 'mage',
    roleLabel: 'Магия (Роль: Маг)',
    difficulty: 'Сложно',
    diffColor: 'bg-red-500/20 text-red-400 border-red-500/30',
    summary: 'Призыв духов через ритуалы. Духи добывают ресурсы, переносят предметы и работают за вас, есть магическое хранилище.',
    startGuide: 'Найдите в JEI книгу Dictionary of Spirits и идите по ней.',
    keywords: ['духи', 'ритуалы', 'ресурсы', 'хранилище', 'occultism', 'окультизм'],
    details: [
      'Призыв духов через ритуалы.',
      'Духи добывают ресурсы, переносят предметы и выполняют работу за игрока.',
      'В моде есть магическое хранилище.'
    ]
  },
  {
    id: 'malum',
    title: 'Malum',
    role: 'mage',
    roleLabel: 'Магия (Роль: Маг)',
    difficulty: 'Сложно',
    diffColor: 'bg-red-500/20 text-red-400 border-red-500/30',
    summary: 'Тёмная магия: вы собираете духи из убитых мобов и делаете из них артефакты и снаряжение.',
    startGuide: 'Откройте книгу мода (Encyclopedia Arcana). Для сбора духов нужна коса.',
    keywords: ['тёмная магия', 'духи', 'коса', 'артефакты', 'снаряжение', 'malum'],
    details: [
      'Сбор духов с убитых мобов с помощью косы.',
      'Создание артефактов и снаряжения на основе собранных духов.',
      'Внутриигровой справочник — Encyclopedia Arcana.'
    ]
  },
  {
    id: 'hogwartscraft',
    title: 'Hogwartscraft by Michelle',
    role: 'mage',
    roleLabel: 'Магия',
    difficulty: 'Уточнить',
    needsClarification: true,
    diffColor: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    summary: 'Магия в духе «Гарри Поттера» (уточнить): точную страницу этой версии найти не удалось, поэтому палочки и мётлы не гарантируются.',
    startGuide: 'Поиск @hogwarts в JEI покажет все предметы мода.',
    keywords: ['гарри поттер', 'hogwarts', 'магия', 'уточнить', 'палочки', 'мётлы'],
    details: [
      'Статус: (уточнить) — точная страница этой версии не найдена.',
      'Палочки и мётлы не гарантируются — проверьте доступные предметы через @hogwarts в JEI.'
    ]
  },
  {
    id: 'mo-enchantments',
    title: "Mo' Enchantments + Loot Compat",
    role: 'mage',
    roleLabel: 'Магия и Зачарования',
    difficulty: 'Просто',
    diffColor: 'bg-green-500/20 text-green-400 border-green-500/30',
    summary: 'Новые зачарования; второй файл добавляет их в лут.',
    startGuide: 'Смотрите стол зачарований, книги и сундуки.',
    keywords: ['зачарования', 'лут', 'сундуки', 'книги', 'enchantments'],
    details: [
      'Добавляет новые зачарования в игру.',
      'Модуль Loot Compat добавляет новые зачарования в генерируемый лут.'
    ]
  },
  {
    id: 'relics',
    title: 'Relics',
    role: 'mage',
    roleLabel: 'Артефакты',
    difficulty: 'Средне',
    diffColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    summary: 'Особые артефакты со способностями, которые прокачиваются по мере использования.',
    startGuide: 'Ищите в сундуках и надевайте в слоты аксессуаров.',
    keywords: ['артефакты', 'прокачка', 'способности', 'аксессуары', 'relics'],
    details: [
      'Особые артефакты с уникальными способностями.',
      'Способности и характеристики прокачиваются по мере использования.'
    ]
  },
  {
    id: 'artifacts',
    title: 'Artifacts',
    role: 'mage',
    roleLabel: 'Аксессуары',
    difficulty: 'Просто',
    diffColor: 'bg-green-500/20 text-green-400 border-green-500/30',
    summary: 'Редкие аксессуары с полезными эффектами.',
    startGuide: 'Ищите в подземных сундуках и у мимиков.',
    keywords: ['аксессуары', 'мимики', 'сундуки', 'эффекты', 'artifacts'],
    details: [
      'Редкие аксессуары с полезными пассивными эффектами.',
      'Встречаются в подземных сундуках и у мимиков.'
    ]
  },

  // ================= 2. ТЕХНИКА, МЕХАНИЗМЫ, КОРАБЛИ И ПОЕЗДА =================
  {
    id: 'create',
    title: 'Create',
    role: 'engineer',
    roleLabel: 'Техника (Роль: Инженер)',
    difficulty: 'Средне',
    diffColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    summary: 'Конвейеры, дробилки, прессы, движущиеся конструкции, поезда. Основа техники: механизмы работают от вращения валов и шестерёнок.',
    startGuide: 'Начинать лучше с водяного колеса и андезитового сплава. Наведите на предмет в инвентаре и удерживайте W: откроется анимированная подсказка Ponder.',
    wikiUrl: 'https://wiki.createmod.net/',
    keywords: ['create', 'конвейеры', 'дробилки', 'прессы', 'поезда', 'шестерёнки', 'валы', 'ponder'],
    details: [
      'Основа технической ветки сборки: работа от вращения валов и шестерёнок.',
      'Конвейеры, дробилки, прессы, движущиеся конструкции и поезда.',
      'Удерживайте W над предметом в инвентаре для просмотра Ponder.'
    ]
  },
  {
    id: 'create-addition',
    title: 'Create Crafts & Additions (createaddition)',
    role: 'engineer',
    roleLabel: 'Техника',
    difficulty: 'Средне',
    diffColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    summary: 'Добавляет в Create электричество: преобразует вращение в энергию и обратно.',
    startGuide: 'Изучайте после основ Create.',
    keywords: ['create', 'электричество', 'энергия', 'createaddition', 'вращение'],
    details: [
      'Преобразует механическое вращение Create в электрическую энергию и обратно.'
    ]
  },
  {
    id: 'create-copycats',
    title: 'Create: Copycats+',
    role: 'engineer',
    roleLabel: 'Техника и Декор',
    difficulty: 'Просто',
    diffColor: 'bg-green-500/20 text-green-400 border-green-500/30',
    summary: 'Блоки, принимающие вид других материалов, для красивых механизмов.',
    startGuide: 'Поставьте блок и кликните по нему материалом.',
    keywords: ['create', 'copycats', 'маскировка', 'блоки', 'механизмы'],
    details: [
      'Позволяет декорировать блоки и механизмы под вид других материалов.'
    ]
  },
  {
    id: 'create-railways',
    title: "Create: Steam 'n' Rails (railways, неофициальный порт)",
    role: 'engineer',
    roleLabel: 'Поезда',
    difficulty: 'Средне',
    unofficialPort: true,
    diffColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    summary: 'Расширяет поезда Create: новые рельсы, детали и оформление (неофициальный порт).',
    startGuide: 'Сначала постройте обычный поезд Create.',
    keywords: ['create', 'поезда', 'рельсы', 'railways', 'неофициальный порт'],
    details: [
      'Добавляет новые рельсы, детали и варианты оформления для поездов Create.',
      'Отмечен как неофициальный порт.'
    ]
  },
  {
    id: 'create-slice-and-dice',
    title: 'Create: Slice & Dice',
    role: 'engineer',
    roleLabel: 'Автоматизация еды',
    difficulty: 'Просто',
    diffColor: 'bg-green-500/20 text-green-400 border-green-500/30',
    summary: 'Автоматизирует готовку Farmer\'s Delight механизмами Create.',
    startGuide: 'Найдите Slicer в JEI.',
    keywords: ['create', 'slice and dice', 'еда', 'готовка', 'автоматизация', 'slicer'],
    details: [
      'Связывает механизмы Create с готовкой и нарезкой из Farmer\'s Delight.'
    ]
  },
  {
    id: 'railhold',
    title: 'Railhold',
    role: 'engineer',
    roleLabel: 'Железная дорога',
    difficulty: 'Уточнить',
    needsClarification: true,
    diffColor: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    summary: 'Судя по названию, связан с железной дорогой (уточнить).',
    startGuide: 'Проверьте предметы по @railhold в JEI.',
    keywords: ['railhold', 'железная дорога', 'рельсы', 'уточнить'],
    details: [
      'Статус: (уточнить) — назначение по названию требует проверки в игре через @railhold.'
    ]
  },
  {
    id: 'valkyrien-skies',
    title: 'Valkyrien Skies 2.0 (неофициальный)',
    role: 'engineer',
    roleLabel: 'Физика кораблей',
    difficulty: 'Сложно',
    unofficialPort: true,
    diffColor: 'bg-red-500/20 text-red-400 border-red-500/30',
    summary: 'Физика для построек из блоков: они превращаются в движущиеся корабли (неофициальный порт).',
    startGuide: 'Используется вместе с Eureka. Перед большой постройкой сделайте копию мира и маленький тестовый корабль.',
    wikiUrl: 'https://www.modpackindex.com/mod/182771/valkyrien-skies-20-unofficial',
    keywords: ['valkyrien skies', 'корабли', 'физика', 'постройки', 'неофициальный'],
    details: [
      'Придаёт постройкам из блоков физику движущихся судов.',
      'Работает в связке с Eureka; при ошибках не пишите оригинальным авторам, так как это неофициальная сборка.'
    ]
  },
  {
    id: 'eureka',
    title: 'Eureka 2.0 (неофициальный)',
    role: 'engineer',
    roleLabel: 'Корабли и дирижабли',
    difficulty: 'Сложно',
    unofficialPort: true,
    diffColor: 'bg-red-500/20 text-red-400 border-red-500/30',
    summary: 'Штурвал: собирает вашу постройку в управляемый корабль или дирижабль (неофициальный порт).',
    startGuide: 'Постройте корпус, поставьте штурвал и соберите судно через его меню.',
    keywords: ['eureka', 'штурвал', 'корабль', 'дирижабль', 'неофициальный'],
    details: [
      'Позволяет собрать конструкцию из блоков в управляемый корабль или дирижабль через штурвал.',
      'Неофициальный порт — используйте тестовые сборки перед крупными проектами.'
    ]
  },
  {
    id: 'sable',
    title: 'Sable',
    role: 'engineer',
    roleLabel: 'Физика',
    difficulty: 'Служебный',
    diffColor: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    summary: 'Другой физический движок для подвижных конструкций. Служебная основа для других модов.',
    startGuide: 'Отдельно изучать не нужно.',
    keywords: ['sable', 'физика', 'движок', 'конструкции'],
    details: [
      'Физический движок для подвижных конструкций, служащий основой для других модов (например, Sable: Ships).'
    ]
  },
  {
    id: 'sable-ships',
    title: 'Sable: Ships',
    role: 'engineer',
    roleLabel: 'Корабли',
    difficulty: 'Средне',
    diffColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    summary: 'Постройка своих кораблей на физике Sable, управление настраивается.',
    startGuide: 'Проверьте предметы мода в JEI.',
    keywords: ['sable ships', 'корабли', 'физика', 'управление'],
    details: [
      'Позволяет строить собственные корабли на базе физического движка Sable с настраиваемым управлением.'
    ]
  },
  {
    id: 'small-ships',
    title: 'Small Ships',
    role: 'engineer',
    roleLabel: 'Корабли (Рекомендуем новичкам)',
    difficulty: 'Просто',
    diffColor: 'bg-green-500/20 text-green-400 border-green-500/30',
    summary: 'Готовые парусные корабли с местами для экипажа и грузом. Самый простой способ выйти в море.',
    startGuide: 'Поставьте верфь (Dockyard) у широкой и глубокой воды, нажмите по ней ПКМ, выберите корабль и дерево. Материалы берутся из инвентаря (проверьте в игре).',
    keywords: ['small ships', 'корабли', 'парусник', 'верфь', 'dockyard', 'море', 'экипаж'],
    details: [
      'Самый простой способ выйти в море среди трёх корабельных систем сборки.',
      'Имеет места для экипажа и грузовое пространство.'
    ]
  },
  {
    id: 'small-ships-viking',
    title: 'Small Ships: Viking Addon',
    role: 'engineer',
    roleLabel: 'Корабли',
    difficulty: 'Просто',
    diffColor: 'bg-green-500/20 text-green-400 border-green-500/30',
    summary: 'Корабли в стиле викингов.',
    startGuide: 'Так же, как Small Ships — через верфь (Dockyard) у глубокой воды.',
    keywords: ['small ships', 'викинги', 'корабли', 'древесина'],
    details: [
      'Дополнение к Small Ships с кораблями в стиле викингов.'
    ]
  },
  {
    id: 'astikor-carts',
    title: 'Astikor Carts Redux',
    role: 'engineer',
    roleLabel: 'Повозки',
    difficulty: 'Просто',
    diffColor: 'bg-green-500/20 text-green-400 border-green-500/30',
    summary: 'Повозки: груз, плуг, которые тянут животные или игрок.',
    startGuide: 'Скрафтите колесо и повозку.',
    keywords: ['повозки', 'плуг', 'груз', 'животные', 'astikor'],
    details: [
      'Грузовые повозки и плуги, которые можно прицеплять к животным или тянуть самостоятельно.'
    ]
  },
  {
    id: 'ad-astra',
    title: 'Ad Astra',
    role: 'engineer',
    roleLabel: 'Космос (Роль: Инженер)',
    difficulty: 'Сложно',
    diffColor: 'bg-red-500/20 text-red-400 border-red-500/30',
    summary: 'Космос: ракеты, топливо, скафандры, планеты.',
    startGuide: 'Позднее развитие: найдите в JEI NASA Workbench. Без скафандра и кислорода в космос не летите.',
    keywords: ['космос', 'ракеты', 'топливо', 'скафандр', 'кислород', 'планеты', 'ad astra'],
    details: [
      'Полёты в космос и на другие планеты на ракетах.',
      'Требует топлива, скафандра и контроля кислорода.'
    ]
  },

  // ================= 3. МИР, ИЗМЕРЕНИЯ, СТРУКТУРЫ, СЕЗОНЫ =================
  {
    id: 'terralith',
    title: 'Terralith',
    role: 'world',
    roleLabel: 'Мир и биомы',
    difficulty: 'Просто',
    diffColor: 'bg-green-500/20 text-green-400 border-green-500/30',
    summary: 'Много новых и красивых биомов обычного мира.',
    startGuide: 'Просто исследуйте мир.',
    keywords: ['биомы', 'мир', 'природа', 'terralith', 'исследование'],
    details: [
      'Добавляет множество разнообразных биомов в обычном измерении.'
    ]
  },
  {
    id: 'tectonic',
    title: 'Tectonic',
    role: 'world',
    roleLabel: 'Рельеф мира',
    difficulty: 'Просто',
    diffColor: 'bg-green-500/20 text-green-400 border-green-500/30',
    summary: 'Более крупный рельеф: горные цепи, долины, материки.',
    startGuide: 'Берите еду и камни телепортации в дальние походы.',
    keywords: ['рельеф', 'горы', 'долины', 'материки', 'tectonic'],
    details: [
      'Масштабирует генерацию рельефа: огромные горные хребты, долины и материки.'
    ]
  },
  {
    id: 'twilight-forest',
    title: 'The Twilight Forest',
    role: 'world',
    roleLabel: 'Измерение (Роль: Исследователь)',
    difficulty: 'Средне',
    diffColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    summary: 'Сумеречный лес: отдельное измерение с боссами по порядку.',
    startGuide: 'Классический портал: яма с водой 2×2 на земле, вокруг цветы, бросить алмаз. Не прыгайте в него без снаряжения.',
    keywords: ['сумеречный лес', 'измерение', 'боссы', 'портал', 'twilight forest'],
    details: [
      'Отдельное измерение с прогрессией по боссам.',
      'Требует подготовки и хорошего снаряжения перед входом.'
    ]
  },
  {
    id: 'deeper-and-darker',
    title: 'Deeper and Darker',
    role: 'world',
    roleLabel: 'Измерение',
    difficulty: 'Сложно',
    diffColor: 'bg-red-500/20 text-red-400 border-red-500/30',
    summary: 'Расширяет Deep Dark и добавляет новое тёмное измерение.',
    startGuide: 'Поздняя игра: путь идёт через Древний город и Вардена.',
    keywords: ['deep dark', 'варден', 'измерение', 'древний город', 'deeper and darker'],
    details: [
      'Развивает механики Deep Dark и открывает новое тёмное измерение для поздней игры.'
    ]
  },
  {
    id: 'when-dungeons-arise',
    title: 'When Dungeons Arise',
    role: 'world',
    roleLabel: 'Структуры (Роль: Исследователь)',
    difficulty: 'Сложно',
    diffColor: 'bg-red-500/20 text-red-400 border-red-500/30',
    summary: 'Огромные замки, башни, корабли и крепости с лутом и врагами.',
    startGuide: 'Идите группой.',
    keywords: ['данжи', 'замки', 'башни', 'крепости', 'лут', 'dungeons arise'],
    details: [
      'Масштабные структуры с сильными противниками и ценной добычей — лучше исследовать вместе с друзьями.'
    ]
  },
  {
    id: 'lootr',
    title: 'Lootr',
    role: 'world',
    roleLabel: 'Лут и сундуки',
    difficulty: 'Просто',
    diffColor: 'bg-green-500/20 text-green-400 border-green-500/30',
    summary: 'Лут в найденных сундуках у каждого игрока свой.',
    startGuide: 'Не ломайте такие сундуки: другим тоже нужен лут.',
    keywords: ['лут', 'сундуки', 'кооператив', 'lootr'],
    details: [
      'Каждый игрок получает собственный набор добычи в сундуках структур.',
      'Не ломайте сундуки Lootr, чтобы не лишить других игроков лута.'
    ]
  },
  {
    id: 'serene-seasons',
    title: 'Serene Seasons',
    role: 'world',
    roleLabel: 'Времена года',
    difficulty: 'Просто',
    diffColor: 'bg-green-500/20 text-green-400 border-green-500/30',
    summary: 'Времена года: меняются цвета, погода и рост культур.',
    startGuide: 'Не все растения растут в любой сезон. Календарь покажет, какой сезон сейчас.',
    keywords: ['сезоны', 'времена года', 'урожай', 'погода', 'календарь', 'serene seasons'],
    details: [
      'Смена времён года влияет на визуальный вид мира, погоду и рост сельскохозяйственных культур.'
    ]
  },
  {
    id: 'serene-seasons-plus',
    title: 'Serene Seasons Plus',
    role: 'world',
    roleLabel: 'Времена года',
    difficulty: 'Уточнить',
    needsClarification: true,
    diffColor: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    summary: 'Дополнение к сезонам; точный набор функций (уточнить).',
    startGuide: 'Изменения будут заметны в течение года.',
    keywords: ['сезоны', 'serene seasons plus', 'уточнить'],
    details: [
      'Дополнение к Serene Seasons; точный список изменений требует уточнения (уточнить).'
    ]
  },
  {
    id: 'seasons-fix',
    title: 'Seasons Fix',
    role: 'world',
    roleLabel: 'Времена года',
    difficulty: 'Служебный',
    diffColor: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    summary: 'Исправления для работы сезонов.',
    startGuide: 'Отдельных действий не требует.',
    keywords: ['сезоны', 'исправления', 'seasons fix'],
    details: [
      'Технические исправления для корректной работы сезонных механик.'
    ]
  },
  {
    id: 'vanilla-backport',
    title: 'Vanilla Backport',
    role: 'world',
    roleLabel: 'Контент версий',
    difficulty: 'Просто',
    diffColor: 'bg-green-500/20 text-green-400 border-green-500/30',
    summary: 'Переносит в 1.21.1 новинки более новых версий Minecraft. Функции можно отключать в настройках.',
    startGuide: 'Незнакомый блок может быть и из новой ванильной игры.',
    keywords: ['backport', '1.21.1', 'новинки', 'блоки', 'vanilla backport'],
    details: [
      'Добавляет в 1.21.1 элементы из более свежих версий Minecraft.',
      'Отдельные функции можно отключать в настройках.'
    ]
  },
  {
    id: 'vb-extras',
    title: 'VB Extras (vbextras)',
    role: 'world',
    roleLabel: 'Контент версий',
    difficulty: 'Уточнить',
    needsClarification: true,
    diffColor: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    summary: 'Вероятно, дополнение к Vanilla Backport (уточнить).',
    startGuide: 'Смотрите @vbextras в JEI.',
    keywords: ['vbextras', 'vanilla backport', 'уточнить'],
    details: [
      'Вероятно расширяет Vanilla Backport — статус требует проверки (уточнить) через @vbextras в JEI.'
    ]
  },

  // ================= 4. МОНСТРЫ И СЛОЖНОСТЬ =================
  {
    id: 'zombie-apocalypse-addon',
    title: 'Zombie Apocalypse Addon',
    role: 'monsters',
    roleLabel: 'Угроза и сложность',
    difficulty: 'Сложно',
    diffColor: 'bg-red-500/20 text-red-400 border-red-500/30',
    summary: 'Зомби-орды, кровавые луны, рост сложности по дням. Ломание и ставка блоков зомби по умолчанию выключены. Команда /za показывает текущее состояние.',
    startGuide: 'Используйте команду /za для проверки состояния. Если друзьям тяжело, админ может применить /za preset casual.',
    wikiUrl: 'https://github.com/Riqqqque/ZombieApocalypseAddon/wiki/Home',
    keywords: ['зомби', 'орды', 'кровавая луна', 'сложность', '/za', 'zombie apocalypse'],
    details: [
      'Зомби-орды, кровавые луны и рост сложности с течением дней.',
      'Ломание и установка блоков зомби по умолчанию выключены.',
      'Команда /za показывает текущее состояние.'
    ]
  },
  {
    id: 'born-in-chaos',
    title: 'Born in Chaos',
    role: 'monsters',
    roleLabel: 'Монстры и боссы',
    difficulty: 'Сложно',
    diffColor: 'bg-red-500/20 text-red-400 border-red-500/30',
    summary: 'Множество новых мрачных монстров, мини-боссы, предметы с них.',
    startGuide: 'Не ходите далеко без брони и еды.',
    keywords: ['монстры', 'мини-боссы', 'мрачные', 'born in chaos'],
    details: [
      'Добавляет мрачных существ, мини-боссов и трофеи с них.'
    ]
  },
  {
    id: 'the-graveyard',
    title: 'The Graveyard',
    role: 'monsters',
    roleLabel: 'Структуры и нежить',
    difficulty: 'Средне',
    diffColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    summary: 'Кладбища, склепы и нежить.',
    startGuide: 'Будьте осторожны при исследовании кладбищ и склепов.',
    keywords: ['кладбища', 'склепы', 'нежить', 'graveyard'],
    details: [
      'Генерирует кладбища и склепы с нежитью и тематическим наполнением.'
    ]
  },
  {
    id: 'cave-dweller',
    title: 'Cave Dweller',
    role: 'monsters',
    roleLabel: 'Хоррор в пещерах',
    difficulty: 'Сложно',
    diffColor: 'bg-red-500/20 text-red-400 border-red-500/30',
    summary: 'Жуткое существо, которое охотится на игроков в пещерах.',
    startGuide: 'Не спускайтесь в глубокие пещеры в одиночку без хорошей экипировки.',
    keywords: ['пещеры', 'монстр', 'хоррор', 'cave dweller'],
    details: [
      'Опасный подземный хищник, охотящийся на игроков в пещерах.'
    ]
  },
  {
    id: 'eyes-in-the-darkness',
    title: 'Eyes in the Darkness',
    role: 'monsters',
    roleLabel: 'Атмосфера и угрозы',
    difficulty: 'Средне',
    diffColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    summary: 'Глаза в темноте: хоррор-атмосфера. Держите места освещёнными.',
    startGuide: 'Освещайте базу и подходы к ней.',
    keywords: ['темнота', 'глаза', 'хоррор', 'освещение', 'eyes in the darkness'],
    details: [
      'Создаёт жуткую атмосферу в неосвещённых местах — держите территорию освещённой.'
    ]
  },
  {
    id: 'improved-mobs',
    title: 'Improved Mobs',
    role: 'monsters',
    roleLabel: 'Сложность мобов',
    difficulty: 'Сложно',
    diffColor: 'bg-red-500/20 text-red-400 border-red-500/30',
    summary: 'Усиливает врагов: снаряжение и новое поведение, сложность может расти. Зависит от настроек сервера.',
    startGuide: 'Берите броню, оружие и еду перед вылазками.',
    keywords: ['мобы', 'сложность', 'снаряжение', 'improved mobs'],
    details: [
      'Наделяет враждебных мобов снаряжением и усилениями в зависимости от настроек сервера.'
    ]
  },
  {
    id: 'hostile-tactics',
    title: 'Hostile Tactics',
    role: 'monsters',
    roleLabel: 'ИИ врагов',
    difficulty: 'Средне',
    diffColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    summary: 'Делает обычных враждебных мобов умнее, а не просто сильнее. Работает на сервере.',
    startGuide: 'Учитывайте тактику врагов в бою и держите дистанцию/укрытия.',
    wikiUrl: 'https://modrinth.com/project/gvkYNFPn',
    keywords: ['тактика', 'ии', 'мобы', 'умные враги', 'hostile tactics'],
    details: [
      'Улучшает поведение враждебных мобов на стороне сервера.'
    ]
  },
  {
    id: 'no-creeper-explosion',
    title: 'No Creeper Explosion',
    role: 'monsters',
    roleLabel: 'Криперы',
    difficulty: 'Уточнить',
    needsClarification: true,
    diffColor: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    summary: 'Меняет взрывы криперов: судя по названию, отключает их. Проверьте, остаётся ли урон игрокам (уточнить).',
    startGuide: 'Проверьте в игре, наносит ли крипер урон игрокам при взрыве.',
    keywords: ['крипер', 'взрыв', 'урон', 'уточнить', 'creeper'],
    details: [
      'Судя по названию, отключает разрушение от взрывов криперов.',
      'Требует проверки (уточнить), остаётся ли урон по игрокам.'
    ]
  },

  // ================= 5. ЖИВОТНЫЕ И ПИТОМЦЫ =================
  {
    id: 'alexs-mobs',
    title: "Alex's Mobs",
    role: 'pets',
    roleLabel: 'Фауна',
    difficulty: 'Средне',
    diffColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    summary: 'Много существ, от мирных до опасных; у многих своя польза и свой способ приручения.',
    startGuide: 'Изучайте повадки разных животных и способы их приручения.',
    keywords: ['животные', 'приручение', 'фауна', 'alexs mobs', 'существа'],
    details: [
      'Большое разнообразие существ с уникальным поведением, полезными свойствами и методами приручения.'
    ]
  },
  {
    id: 'naturalist',
    title: 'Naturalist',
    role: 'pets',
    roleLabel: 'Дикая природа',
    difficulty: 'Просто',
    diffColor: 'bg-green-500/20 text-green-400 border-green-500/30',
    summary: 'Реалистичные дикие животные и насекомые.',
    startGuide: 'Встречаются в природных биомах при исследовании мира.',
    keywords: ['животные', 'насекомые', 'природа', 'naturalist'],
    details: [
      'Добавляет диких животных и насекомых для оживления биомов.'
    ]
  },
  {
    id: 'tameable-foxes',
    title: 'Tameable Foxes',
    role: 'pets',
    roleLabel: 'Питомцы',
    difficulty: 'Просто',
    diffColor: 'bg-green-500/20 text-green-400 border-green-500/30',
    summary: 'Лис можно полноценно приручать.',
    startGuide: 'Приручайте лис и используйте их как компаньонов.',
    keywords: ['лисы', 'приручение', 'питомцы', 'foxes'],
    details: [
      'Позволяет полноценно приручать лис.'
    ]
  },
  {
    id: 'domestication-innovation',
    title: 'Domestication Innovation: Redomesticate',
    role: 'pets',
    roleLabel: 'Питомцы',
    difficulty: 'Просто',
    diffColor: 'bg-green-500/20 text-green-400 border-green-500/30',
    summary: 'Расширяет уход за питомцами: ошейники с зачарованиями, лежанки и другая забота.',
    startGuide: 'Делайте ошейники и лежанки для защиты и комфорта питомцев.',
    keywords: ['питомцы', 'ошейники', 'зачарования', 'лежанки', 'domestication'],
    details: [
      'Добавляет ошейники с зачарованиями, лежанки и возможности ухода за питомцами.'
    ]
  },
  {
    id: 'critter-armory',
    title: 'Critter Armory',
    role: 'pets',
    roleLabel: 'Броня для животных',
    difficulty: 'Просто',
    diffColor: 'bg-green-500/20 text-green-400 border-green-500/30',
    summary: 'Броня для лошадей, волков, котов, кур, коров, свиней и других.',
    startGuide: 'Надевайте броню на питомцев и животных перед опасными походами.',
    keywords: ['броня', 'питомцы', 'лошади', 'волки', 'коты', 'животные'],
    details: [
      'Позволяет экипировать бронёй различных животных и питомцев.'
    ]
  },
  {
    id: 'angel-collars',
    title: 'Angel Collars',
    role: 'pets',
    roleLabel: 'Питомцы',
    difficulty: 'Уточнить',
    needsClarification: true,
    diffColor: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    summary: 'Особые ошейники для питомцев; эффект (уточнить).',
    startGuide: 'Проверьте крафт и свойства ошейников в JEI/игре.',
    keywords: ['ошейники', 'питомцы', 'angel collars', 'уточнить'],
    details: [
      'Добавляет особые ошейники для питомцев; точный эффект требует уточнения (уточнить).'
    ]
  },
  {
    id: 'foxes-stuff',
    title: 'Foxes Stuff (foxesstuff)',
    role: 'pets',
    roleLabel: 'Питомцы',
    difficulty: 'Уточнить',
    needsClarification: true,
    diffColor: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    summary: 'Содержимое по названию точно определить нельзя (уточнить).',
    startGuide: 'Проверьте предметы мода в JEI или меню Mods.',
    keywords: ['foxesstuff', 'лисы', 'уточнить'],
    details: [
      'Содержимое по названию точно не определено — помечено как (уточнить).'
    ]
  },

  // ================= 6. ЕДА И ФЕРМЕРСТВО =================
  {
    id: 'farmers-delight',
    title: "Farmer's Delight",
    role: 'cook',
    roleLabel: 'Кухня (Роль: Повар и фермер)',
    difficulty: 'Просто',
    diffColor: 'bg-green-500/20 text-green-400 border-green-500/30',
    summary: 'Основа: новые культуры, ножи, доска, плита, кастрюля, сытные блюда с эффектами.',
    startGuide: 'Начните с ножа, разделочной доски и кастрюли из Farmer\'s Delight.',
    wikiUrl: 'https://farmersdelight.fandom.com/wiki/Farmer%27s_Delight_Wiki',
    keywords: ['еда', 'кухня', 'нож', 'доска', 'кастрюля', 'плита', 'фермер', 'delight'],
    details: [
      'Новые культуры, ножи, разделочная доска, плита и кастрюля.',
      'Сытные блюда с полезными эффектами.',
      'Страница мода на CurseForge: https://www.curseforge.com/minecraft/mc-mods/farmers-delight'
    ]
  },
  {
    id: 'extra-delight',
    title: 'Extra Delight',
    role: 'cook',
    roleLabel: 'Кухня',
    difficulty: 'Просто',
    diffColor: 'bg-green-500/20 text-green-400 border-green-500/30',
    summary: 'Много новых рецептов и кухонных приборов.',
    startGuide: 'Изучайте новые рецепты и приборы через JEI после старта в Farmer\'s Delight.',
    keywords: ['еда', 'рецепты', 'кухня', 'extra delight'],
    details: [
      'Расширяет кулинарию новыми рецептами и кухонными приборами.'
    ]
  },
  {
    id: 'more-delight',
    title: 'More Delight',
    role: 'cook',
    roleLabel: 'Кухня',
    difficulty: 'Просто',
    diffColor: 'bg-green-500/20 text-green-400 border-green-500/30',
    summary: 'Дополнительные блюда.',
    startGuide: 'Ищите новые блюда в JEI.',
    keywords: ['еда', 'блюда', 'more delight'],
    details: [
      'Добавляет дополнительные блюда для кухни.'
    ]
  },
  {
    id: 'storage-delight',
    title: 'Storage Delight',
    role: 'cook',
    roleLabel: 'Хранение на кухне',
    difficulty: 'Просто',
    diffColor: 'bg-green-500/20 text-green-400 border-green-500/30',
    summary: 'Кухонные шкафы и хранение в стиле Farmer\'s Delight.',
    startGuide: 'Используйте шкафы для удобного хранения продуктов и посуды.',
    keywords: ['шкафы', 'хранение', 'кухня', 'storage delight'],
    details: [
      'Кухонные шкафы и блоки хранения, оформленные в стиле Farmer\'s Delight.'
    ]
  },
  {
    id: 'ars-delight',
    title: 'Ars Delight',
    role: 'cook',
    roleLabel: 'Магическая кулинария',
    difficulty: 'Средне',
    diffColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    summary: 'Еда на магических ингредиентах Ars Nouveau.',
    startGuide: 'Совмещайте ингредиенты Ars Nouveau с готовкой.',
    keywords: ['еда', 'магия', 'ars nouveau', 'ars delight'],
    details: [
      'Добавляет блюда с использованием магических ингредиентов из Ars Nouveau.'
    ]
  },
  {
    id: 'vinery',
    title: "Let's Do: Vinery",
    role: 'cook',
    roleLabel: 'Виноделие',
    difficulty: 'Средне',
    diffColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    summary: 'Виноградники, бочки, вино.',
    startGuide: 'Выращивайте виноград и используйте бочки для виноделия.',
    keywords: ['вино', 'виноградники', 'бочки', 'vinery', 'lets do'],
    details: [
      'Виноградники, бочки и производство вина.'
    ]
  },
  {
    id: 'hands-on-delight',
    title: 'Hands-On Delight',
    role: 'cook',
    roleLabel: 'Интерактивная готовка',
    difficulty: 'Просто',
    diffColor: 'bg-green-500/20 text-green-400 border-green-500/30',
    summary: 'Готовка «руками»: камера подлетает к посуде, вы режете, мешаете и переворачиваете без меню.',
    startGuide: 'Подойдите к посуде и взаимодействуйте напрямую в мире.',
    wikiUrl: 'https://www.modpackindex.com/mod/241284/hands-on-delight',
    keywords: ['готовка', 'руками', 'посуда', 'hands-on delight'],
    details: [
      'Позволяет резать, мешать и переворачивать продукты прямо у посуды без открытия меню.'
    ]
  },
  {
    id: 'appleskin',
    title: 'AppleSkin',
    role: 'cook',
    roleLabel: 'Интерфейс еды',
    difficulty: 'Просто',
    diffColor: 'bg-green-500/20 text-green-400 border-green-500/30',
    summary: 'Показывает, сколько голода и насыщения даст еда.',
    startGuide: 'Наведите на еду в инвентаре, чтобы увидеть значения голода и насыщения.',
    keywords: ['голод', 'насыщение', 'еда', 'appleskin'],
    details: [
      'Отображает восстановление голода и насыщения для продуктов.'
    ]
  },

  // ================= 7. ОРУЖИЕ, СНАРЯЖЕНИЕ, ИНВЕНТАРЬ =================
  {
    id: 'tacz',
    title: 'TaCZ (Timeless and Classics Zero)',
    role: 'gear',
    roleLabel: 'Оружие (Роль: Боец)',
    difficulty: 'Средне',
    diffColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    summary: 'Огнестрельное оружие, патроны и обвесы. Крафт на оружейном столе. Патроны нужны отдельно.',
    startGuide: 'Сделайте оружейный стол, скрафтите оружие и отдельно подготовьте патроны.',
    keywords: ['оружие', 'огнестрел', 'патроны', 'обвесы', 'tacz'],
    details: [
      'Огнестрельное оружие, патроны и обвесы.',
      'Создаётся на оружейном столе; патроны крафтятся отдельно.'
    ]
  },
  {
    id: 'tacz-addon',
    title: 'TaCZ Addon (taczaddon)',
    role: 'gear',
    roleLabel: 'Оружие',
    difficulty: 'Уточнить',
    needsClarification: true,
    diffColor: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    summary: 'Дополнительные возможности к TaCZ (уточнить).',
    startGuide: 'Проверьте добавленный контент в игре/JEI.',
    keywords: ['tacz', 'addon', 'оружие', 'уточнить'],
    details: [
      'Дополнение к TaCZ; конкретные возможности помечены как (уточнить).'
    ]
  },
  {
    id: 'sword-throw',
    title: 'Sword Throw',
    role: 'gear',
    roleLabel: 'Оружие',
    difficulty: 'Просто',
    diffColor: 'bg-green-500/20 text-green-400 border-green-500/30',
    summary: 'Мечи можно метать.',
    startGuide: 'Проверьте клавишу или действие метания меча в управлении.',
    keywords: ['мечи', 'метание', 'оружие', 'sword throw'],
    details: [
      'Позволяет метать мечи.'
    ]
  },
  {
    id: 'curios-api',
    title: 'Curios API',
    role: 'gear',
    roleLabel: 'Слоты аксессуаров',
    difficulty: 'Просто',
    diffColor: 'bg-green-500/20 text-green-400 border-green-500/30',
    summary: 'Отдельные слоты для колец, амулетов и артефактов. Ищите кнопку около инвентаря.',
    startGuide: 'Откройте инвентарь и нажмите кнопку слотов Curios рядом с персонажем.',
    keywords: ['curios', 'кольца', 'амулеты', 'артефакты', 'инвентарь'],
    details: [
      'Добавляет дополнительные слоты для аксессуаров, колец и артефактов.'
    ]
  },
  {
    id: 'travelers-backpack',
    title: "Traveler's Backpack",
    role: 'gear',
    roleLabel: 'Рюкзаки',
    difficulty: 'Просто',
    diffColor: 'bg-green-500/20 text-green-400 border-green-500/30',
    summary: 'Рюкзаки с хранилищем, жидкостями и улучшениями.',
    startGuide: 'Скрафтите рюкзак для дальних походов и хранения вещей/жидкостей.',
    keywords: ['рюкзак', 'хранилище', 'жидкости', 'travelers backpack'],
    details: [
      'Рюкзаки с инвентарём, баками под жидкости и улучшениями.'
    ]
  },
  {
    id: 'inventory-expanded',
    title: 'Inventory Expanded',
    role: 'gear',
    roleLabel: 'Инвентарь',
    difficulty: 'Просто',
    diffColor: 'bg-green-500/20 text-green-400 border-green-500/30',
    summary: 'Перерабатывает инвентарь.',
    startGuide: 'Откройте инвентарь, чтобы оценить расширенные возможности.',
    keywords: ['инвентарь', 'inventory expanded'],
    details: [
      'Перерабатывает и расширяет интерфейс инвентаря.'
    ]
  },
  {
    id: 'corpse',
    title: 'Corpse',
    role: 'gear',
    roleLabel: 'Смерть и вещи',
    difficulty: 'Просто',
    diffColor: 'bg-green-500/20 text-green-400 border-green-500/30',
    summary: 'После смерти вещи остаются в «теле»: вернитесь и заберите.',
    startGuide: 'Если погибли — вернитесь на место смерти и заберите вещи из тела.',
    keywords: ['смерть', 'тело', 'вещи', 'corpse'],
    details: [
      'Сохраняет вещи игрока после смерти в виде тела на месте гибели.'
    ]
  },
  {
    id: 'corpse-curios-compat',
    title: 'Corpse x Curios Compat',
    role: 'gear',
    roleLabel: 'Совместимость',
    difficulty: 'Служебный',
    diffColor: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    summary: 'Сохраняет работу аксессуаров из слотов Curios вместе с телом.',
    startGuide: 'Работает автоматически вместе с Corpse и Curios API.',
    keywords: ['corpse', 'curios', 'совместимость', 'аксессуары'],
    details: [
      'Обеспечивает корректное сохранение слотов Curios при смерти игрока через Corpse.'
    ]
  },
  {
    id: 'range-strains',
    title: 'Range Strains (rangestrains)',
    role: 'gear',
    roleLabel: 'Снаряжение',
    difficulty: 'Уточнить',
    needsClarification: true,
    diffColor: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    summary: 'Назначение не подтвердилось (уточнить).',
    startGuide: 'Проверьте мод в игре или меню Mods.',
    keywords: ['rangestrains', 'уточнить'],
    details: [
      'Назначение по открытым источникам не подтвердилось — помечено как (уточнить).'
    ]
  },

  // ================= 8. СТРОИТЕЛЬСТВО И ДЕКОР =================
  {
    id: 'supplementaries',
    title: 'Supplementaries',
    role: 'builder',
    roleLabel: 'Стройка и декор (Роль: Строитель)',
    difficulty: 'Просто',
    diffColor: 'bg-green-500/20 text-green-400 border-green-500/30',
    summary: 'Полезные и декоративные предметы: банки, верёвки, таблички, механизмы, пушка.',
    startGuide: 'Используйте для декора, логистики и полезных блоков на базе.',
    keywords: ['банки', 'верёвки', 'таблички', 'пушка', 'декор', 'supplementaries'],
    details: [
      'Множество полезных и декоративных блоков: банки, верёвки, таблички, механизмы, пушка и др.'
    ]
  },
  {
    id: 'supplementaries-squared',
    title: 'Supplementaries Squared',
    role: 'builder',
    roleLabel: 'Стройка и декор',
    difficulty: 'Просто',
    diffColor: 'bg-green-500/20 text-green-400 border-green-500/30',
    summary: 'Дополнение с новыми вариантами блоков.',
    startGuide: 'Ищите дополнительные декоративные блоки в JEI.',
    keywords: ['supplementaries squared', 'блоки', 'декор'],
    details: [
      'Добавляет новые варианты блоков в дополнение к Supplementaries.'
    ]
  },
  {
    id: 'amendments',
    title: 'Amendments',
    role: 'builder',
    roleLabel: 'Улучшение блоков',
    difficulty: 'Просто',
    diffColor: 'bg-green-500/20 text-green-400 border-green-500/30',
    summary: 'Улучшает ванильные блоки: котлы, фонари, таблички и др.',
    startGuide: 'Проверяйте знакомые ванильные блоки — у них появились новые детали.',
    keywords: ['котлы', 'фонари', 'таблички', 'amendments', 'ваниль'],
    details: [
      'Расширяет функциональность и вид ванильных блоков (котлы, фонари, таблички и др.).'
    ]
  },
  {
    id: 'quark',
    title: 'Quark',
    role: 'builder',
    roleLabel: 'Стройка и удобства (Роль: Строитель)',
    difficulty: 'Просто',
    diffColor: 'bg-green-500/20 text-green-400 border-green-500/30',
    summary: 'Много небольших улучшений «в духе ванили»: блоки, механики, удобства.',
    startGuide: 'Изучайте новые строительные блоки и механики в процессе игры.',
    keywords: ['quark', 'блоки', 'механики', 'декор', 'удобства'],
    details: [
      'Большой набор строительных блоков, декоративных деталей и механик в стиле ванильного Minecraft.'
    ]
  },
  {
    id: 'mrcrayfish-furniture',
    title: "MrCrayfish's Refurbished Furniture",
    role: 'builder',
    roleLabel: 'Мебель',
    difficulty: 'Просто',
    diffColor: 'bg-green-500/20 text-green-400 border-green-500/30',
    summary: 'Мебель с функциями: кухня, электричество, почта и др.',
    startGuide: 'Обустраивайте дом и кухню функциональной мебелью.',
    keywords: ['мебель', 'кухня', 'электричество', 'почта', 'mrcrayfish'],
    details: [
      'Функциональная мебель: кухонные элементы, электричество, почтовые системы и другие предметы.'
    ]
  },
  {
    id: 'hands-on-furniture',
    title: 'Hands-On Furniture',
    role: 'builder',
    roleLabel: 'Интерактивная мебель',
    difficulty: 'Просто',
    diffColor: 'bg-green-500/20 text-green-400 border-green-500/30',
    summary: 'Холодильники и шкафы MrCrayfish открываются прямо в мире, еду можно раскладывать на полки.',
    startGuide: 'Открывайте холодильники и шкафы напрямую в мире и выкладывайте еду на полки.',
    wikiUrl: 'https://www.curseforge.com/minecraft/mc-mods/hands-on-vanilla',
    keywords: ['холодильники', 'шкафы', 'полки', 'еда', 'hands-on furniture'],
    details: [
      'Холодильники и шкафы MrCrayfish открываются прямо в мире.',
      'Позволяет раскладывать еду на полки.'
    ]
  },
  {
    id: 'hands-on-vanilla',
    title: 'Hands-On Vanilla',
    role: 'builder',
    roleLabel: 'Интерактивные станции',
    difficulty: 'Просто',
    diffColor: 'bg-green-500/20 text-green-400 border-green-500/30',
    summary: 'Верстак и печь открываются на самом блоке, без обычного меню. Каждую из этих двух станций можно отключить в настройках.',
    startGuide: 'Взаимодействуйте с верстаком или печью прямо в мире; при необходимости отключите станцию в настройках.',
    wikiUrl: 'https://www.curseforge.com/minecraft/mc-mods/hands-on-vanilla',
    keywords: ['верстак', 'печь', 'hands-on vanilla', 'настройки'],
    details: [
      'Верстак и печь работают напрямую на блоке без стандартного интерфейса.',
      'Верстак и печь можно по отдельности отключить в настройках.'
    ]
  },
  {
    id: 'macaws-furniture',
    title: "Macaw's Furniture",
    role: 'builder',
    roleLabel: 'Мебель',
    difficulty: 'Просто',
    diffColor: 'bg-green-500/20 text-green-400 border-green-500/30',
    summary: 'Мебель из разных пород дерева.',
    startGuide: 'Подбирайте мебель под породу дерева вашего дома.',
    keywords: ['мебель', 'дерево', 'macaws', 'интерьер'],
    details: [
      'Набор мебели из различных пород дерева.'
    ]
  },
  {
    id: 'lets-do-furniture',
    title: "Let's Do: Furniture",
    role: 'builder',
    roleLabel: 'Мебель и декор',
    difficulty: 'Просто',
    diffColor: 'bg-green-500/20 text-green-400 border-green-500/30',
    summary: 'Ещё один набор мебели и декора.',
    startGuide: 'Смотрите предметы в JEI для оформления комнат и дворов.',
    keywords: ['мебель', 'декор', 'lets do', 'furniture'],
    details: [
      'Дополнительный набор предметов мебели и декора.'
    ]
  },
  {
    id: 'security-craft',
    title: 'SecurityCraft',
    role: 'builder',
    roleLabel: 'Защита базы',
    difficulty: 'Средне',
    diffColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    summary: 'Защита базы: кодовые замки, ключ-карты, усиленные блоки, камеры, мины. С минами осторожно, договоритесь о правилах.',
    startGuide: 'Используйте замки, ключ-карты, усиленные блоки и камеры. С минами будьте аккуратны и согласуйте правила с друзьями.',
    keywords: ['защита', 'замки', 'ключ-карты', 'камеры', 'мины', 'securitycraft'],
    details: [
      'Кодовые замки, ключ-карты, усиленные блоки, камеры наблюдения и мины.',
      'Обязательно договоритесь с друзьями о правилах использования мин.'
    ]
  },
  {
    id: 'orva-alarms',
    title: 'Orva Alarms and Sirens',
    role: 'builder',
    roleLabel: 'Сигнализации и RP',
    difficulty: 'Просто',
    diffColor: 'bg-green-500/20 text-green-400 border-green-500/30',
    summary: 'Сирены и сигнализации, в основном для атмосферы и ролевой игры.',
    startGuide: 'Ставьте для тревог, баз и ролевых сценариев.',
    wikiUrl: 'https://www.curseforge.com/minecraft/mc-mods/orva-alarms',
    keywords: ['сирены', 'сигнализация', 'rp', 'orva alarms'],
    details: [
      'Сирены и сигнализации для атмосферы и ролевой игры.'
    ]
  },
  {
    id: 'placeable-calendar',
    title: 'Placeable Calendar',
    role: 'builder',
    roleLabel: 'Декор и календарь',
    difficulty: 'Уточнить',
    needsClarification: true,
    diffColor: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    summary: 'Календарь, который ставится как блок (уточнить, что он показывает).',
    startGuide: 'Поставьте блок календаря и проверьте его отображение в игре.',
    keywords: ['календарь', 'блок', 'уточнить', 'calendar'],
    details: [
      'Ставится как блок; что именно показывает в вашей версии — требуется уточнить (уточнить).'
    ]
  },

  // ================= 9. ЖИЗНЬ НА СЕРВЕРЕ И УДОБСТВА =================
  {
    id: 'plasmo-voice',
    title: 'Plasmo Voice',
    role: 'server',
    roleLabel: 'Голосовой чат',
    difficulty: 'Просто',
    diffColor: 'bg-green-500/20 text-green-400 border-green-500/30',
    summary: 'Голосовой чат по расстоянию: слышно тех, кто рядом.',
    startGuide: 'Настройте голосовой чат (по умолчанию клавиша V).',
    keywords: ['голосовой чат', 'микрофон', 'v', 'plasmo voice'],
    details: [
      'Голосовое общение в зависимости от расстояния между игроками.'
    ]
  },
  {
    id: 'pv-sound-physics',
    title: 'PV Addon: Sound Physics',
    role: 'server',
    roleLabel: 'Голосовой чат',
    difficulty: 'Просто',
    diffColor: 'bg-green-500/20 text-green-400 border-green-500/30',
    summary: 'Эхо и приглушение голоса стенами.',
    startGuide: 'Работает поверх Plasmo Voice.',
    keywords: ['plasmo voice', 'эхо', 'стены', 'звук'],
    details: [
      'Добавляет эхо и приглушение голоса за стенами в голосовом чате Plasmo Voice.'
    ]
  },
  {
    id: 'pv-spectator',
    title: 'PV Addon: Spectator',
    role: 'server',
    roleLabel: 'Голосовой чат',
    difficulty: 'Просто',
    diffColor: 'bg-green-500/20 text-green-400 border-green-500/30',
    summary: 'Настраивает голосовой чат для наблюдателей.',
    startGuide: 'Актуально при нахождении в режиме наблюдателя.',
    keywords: ['plasmo voice', 'наблюдатель', 'spectator'],
    details: [
      'Регулирует работу голосового чата для игроков в режиме наблюдателя.'
    ]
  },
  {
    id: 'pv-walkie-talkie',
    title: 'PV Addon: Walkie-Talkie',
    role: 'server',
    roleLabel: 'Связь на расстоянии',
    difficulty: 'Просто',
    diffColor: 'bg-green-500/20 text-green-400 border-green-500/30',
    summary: 'Рации для связи на расстоянии.',
    startGuide: 'Возьмите рацию, если нужно общаться с друзьями далеко друг от друга.',
    keywords: ['рация', 'связь', 'plasmo voice', 'walkie-talkie'],
    details: [
      'Позволяет общаться по рациям на расстоянии.'
    ]
  },
  {
    id: 'talking-heads',
    title: 'Talking Heads',
    role: 'server',
    roleLabel: 'Голосовой чат',
    difficulty: 'Уточнить',
    needsClarification: true,
    diffColor: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    summary: 'Визуальное оформление разговора: головы игроков (уточнить).',
    startGuide: 'Понаблюдайте за игроками при разговоре в голосовом чате.',
    keywords: ['головы', 'разговор', 'talking heads', 'уточнить'],
    details: [
      'Визуальное оформление речи/голов игроков при разговоре — детали помечены как (уточнить).'
    ]
  },
  {
    id: 'waystones',
    title: 'Waystones',
    role: 'server',
    roleLabel: 'Телепортация',
    difficulty: 'Просто',
    diffColor: 'bg-green-500/20 text-green-400 border-green-500/30',
    summary: 'Камни телепортации между активированными точками.',
    startGuide: 'Найдите камень телепортации (Waystone) и кликните по нему, чтобы активировать.',
    keywords: ['телепортация', 'waystones', 'камни', 'быстрое перемещение'],
    details: [
      'Позволяет телепортироваться между активированными камнями телепортации.'
    ]
  },
  {
    id: 'comforts',
    title: 'Comforts',
    role: 'server',
    roleLabel: 'Сон и отдых',
    difficulty: 'Просто',
    diffColor: 'bg-green-500/20 text-green-400 border-green-500/30',
    summary: 'Спальники (сон без смены точки возрождения) и гамаки (сон днём).',
    startGuide: 'Берите спальник в походы, чтобы не сбивать точку возрождения, и гамак для дневного отдыха.',
    keywords: ['спальник', 'гамак', 'сон', 'точка возрождения', 'comforts'],
    details: [
      'Спальники позволяют поспать ночью без смены точки возрождения.',
      'Гамаки позволяют спать днём.'
    ]
  },
  {
    id: 'better-days',
    title: 'Better Days',
    role: 'server',
    roleLabel: 'Время суток',
    difficulty: 'Просто',
    diffColor: 'bg-green-500/20 text-green-400 border-green-500/30',
    summary: 'Настраивает длину дня и ночи и ускорение времени во сне.',
    startGuide: 'Параметры задаются конфигурацией сервера.',
    keywords: ['день', 'ночь', 'сон', 'время', 'better days'],
    details: [
      'Позволяет настраивать длительность дня и ночи и ускорение времени во время сна.'
    ]
  },
  {
    id: 'one-sleep-timelapse',
    title: 'One Sleep Timelapse',
    role: 'server',
    roleLabel: 'Сон на сервере',
    difficulty: 'Уточнить',
    needsClarification: true,
    diffColor: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    summary: 'По названию, ускоряет ночь, когда спит один игрок (уточнить).',
    startGuide: 'Проверьте поведение ночи при сне одного игрока на сервере.',
    keywords: ['сон', 'ночь', 'ускорение', 'timelapse', 'уточнить'],
    details: [
      'По названию ускоряет ночь, когда спит один игрок — требуется уточнить (уточнить).'
    ]
  },
  {
    id: 'economics',
    title: 'Economics',
    role: 'server',
    roleLabel: 'Экономика',
    difficulty: 'Уточнить',
    needsClarification: true,
    diffColor: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    summary: 'Экономика сервера; команды и магазины зависят от версии (уточнить).',
    startGuide: 'Уточните доступные команды и правила экономики у администратора сервера.',
    keywords: ['экономика', 'деньги', 'магазины', 'economics', 'уточнить'],
    details: [
      'Мод экономики сервера; точные команды и магазины зависят от версии и настроек (уточнить).'
    ]
  },
  {
    id: 'villager-trading-plus',
    title: 'Villager Trading Plus',
    role: 'server',
    roleLabel: 'Торговля',
    difficulty: 'Уточнить',
    needsClarification: true,
    diffColor: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    summary: 'Улучшает торговлю с жителями; детали (уточнить).',
    startGuide: 'Откройте меню торговли с жителем и проверьте улучшения.',
    keywords: ['жители', 'торговля', 'villager trading', 'уточнить'],
    details: [
      'Улучшает интерфейс и/или механики торговли с жителями; детали помечены как (уточнить).'
    ]
  },
  {
    id: 'worlds-passports',
    title: "W0rld's Passports",
    role: 'server',
    roleLabel: 'Ролевая игра',
    difficulty: 'Просто',
    diffColor: 'bg-green-500/20 text-green-400 border-green-500/30',
    summary: 'Паспорта в духе игры Papers, Please: можно заполнить свой и принять или отклонить чужой. Не забывайте нажимать Save.',
    startGuide: 'Заполните паспорт и обязательно нажмите Save.',
    wikiUrl: 'https://skinmc.net/project/w0rlds-passports',
    keywords: ['паспорт', 'papers please', 'rp', 'passports'],
    details: [
      'Паспорта в стиле Papers, Please: заполнение своего и проверка/принятие/отклонение чужих.',
      'Не забывайте нажимать Save при сохранении.'
    ]
  },
  {
    id: 'dashboard-admin',
    title: 'DashBoardAdmin',
    role: 'server',
    roleLabel: 'Администрирование',
    difficulty: 'Админ',
    diffColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    summary: 'Панель управления сервером для админов: игроки, мир, роли и права.',
    startGuide: 'Используется администраторами сервера.',
    wikiUrl: 'https://www.curseforge.com/minecraft/mc-mods/dashboardadmin',
    keywords: ['админ', 'панель', 'игроки', 'права', 'dashboardadmin'],
    details: [
      'Панель управления для администраторов: управление игроками, миром, ролями и правами.'
    ]
  },
  {
    id: 'skin-restorer',
    title: 'SkinRestorer',
    role: 'server',
    roleLabel: 'Скины',
    difficulty: 'Просто',
    diffColor: 'bg-green-500/20 text-green-400 border-green-500/30',
    summary: 'Возвращает и меняет скины на сервере (команда /skin).',
    startGuide: 'Используйте команду /skin для смены или восстановления скина.',
    keywords: ['скин', '/skin', 'skinrestorer', 'внешность'],
    details: [
      'Позволяет менять и восстанавливать скины на сервере через команду /skin.'
    ]
  },
  {
    id: 'bluemap',
    title: 'BlueMap',
    role: 'server',
    roleLabel: 'Карта мира',
    difficulty: 'Просто',
    diffColor: 'bg-green-500/20 text-green-400 border-green-500/30',
    summary: 'Трёхмерная карта мира в браузере. Ссылку даёт админ.',
    startGuide: 'Запросите ссылку на веб-карту у администратора сервера.',
    keywords: ['карта', '3d', 'браузер', 'bluemap'],
    details: [
      'Интерактивная 3D-карта мира, открываемая в браузере по ссылке от администратора.'
    ]
  },
  {
    id: 'xaeros-minimap',
    title: "Xaero's Minimap",
    role: 'server',
    roleLabel: 'Миникарта и точки',
    difficulty: 'Просто',
    diffColor: 'bg-green-500/20 text-green-400 border-green-500/30',
    summary: 'Миникарта и точки (waypoints).',
    startGuide: 'Ставьте метки (waypoints) на важные места и базы.',
    keywords: ['миникарта', 'waypoints', 'точки', 'метки', 'xaero'],
    details: [
      'Отображает миникарту и позволяет ставить точки интереса (waypoints).'
    ]
  },
  {
    id: 'jei',
    title: 'JEI',
    role: 'server',
    roleLabel: 'Справочник рецептов',
    difficulty: 'Просто',
    diffColor: 'bg-green-500/20 text-green-400 border-green-500/30',
    summary: 'Справочник предметов и рецептов (R и U). Поиск @название в строке JEI показывает предметы конкретного мода.',
    startGuide: 'Откройте инвентарь: справа список JEI. Наведите на предмет и нажмите R (как сделать) или U (где используется).',
    keywords: ['jei', 'рецепты', 'крафт', 'r', 'u', '@название'],
    details: [
      'R — посмотреть рецепт крафта предмета, U — где предмет используется.',
      'Строка поиска поддерживает фильтр по моду через @название.'
    ]
  },
  {
    id: 'jade',
    title: 'Jade',
    role: 'server',
    roleLabel: 'Подсказки при наведении',
    difficulty: 'Просто',
    diffColor: 'bg-green-500/20 text-green-400 border-green-500/30',
    summary: 'Подсказка о блоке или мобе под прицелом.',
    startGuide: 'Наведите прицел на любой блок или моба — подсказка появится сверху.',
    keywords: ['jade', 'подсказка', 'прицел', 'блок', 'моб'],
    details: [
      'Показывает информацию о блоке или существе, на которое наведён прицел.'
    ]
  },
  {
    id: 'controlling',
    title: 'Controlling',
    role: 'server',
    roleLabel: 'Настройки управления',
    difficulty: 'Просто',
    diffColor: 'bg-green-500/20 text-green-400 border-green-500/30',
    summary: 'Поиск в настройках клавиш, помогает найти конфликты.',
    startGuide: 'Загляните в настройки управления, чтобы быстро найти нужные клавиши и конфликты.',
    keywords: ['клавиши', 'управление', 'конфликты', 'поиск', 'controlling'],
    details: [
      'Добавляет поиск в меню назначения клавиш и помогает выявлять конфликты кнопок.'
    ]
  },
  {
    id: 'clickthrough-plus',
    title: 'ClickThrough Plus',
    role: 'server',
    roleLabel: 'Удобство',
    difficulty: 'Просто',
    diffColor: 'bg-green-500/20 text-green-400 border-green-500/30',
    summary: 'Позволяет кликать сквозь таблички и рамки по сундуку за ними.',
    startGuide: 'Открывайте сундуки прямо через висящие на них таблички или рамки.',
    keywords: ['сундук', 'таблички', 'рамки', 'clickthrough'],
    details: [
      'Упрощает доступ к сундукам, на которых размещены таблички или рамки.'
    ]
  },
  {
    id: 'treechop',
    title: 'TreeChop',
    role: 'server',
    roleLabel: 'Добыча дерева',
    difficulty: 'Просто',
    diffColor: 'bg-green-500/20 text-green-400 border-green-500/30',
    summary: 'Дерево рубится и падает целиком.',
    startGuide: 'Рубите ствол дерева — оно срубится целиком.',
    keywords: ['дерево', 'рубка', 'лес', 'treechop'],
    details: [
      'Позволяет срубать деревья целиком.'
    ]
  },
  {
    id: 'just-zoom',
    title: 'Just Zoom',
    role: 'server',
    roleLabel: 'Камера',
    difficulty: 'Просто',
    diffColor: 'bg-green-500/20 text-green-400 border-green-500/30',
    summary: 'Приближение камеры по клавише.',
    startGuide: 'Нажмите клавишу приближения (проверьте в настройках управления, если меняли).',
    keywords: ['зум', 'приближение', 'камера', 'just zoom'],
    details: [
      'Добавляет приближение обзора по нажатию клавиши.'
    ]
  },

  // ================= 10. АТМОСФЕРА: ГРАФИКА, ЗВУК, АНИМАЦИИ =================
  {
    id: 'distant-horizons',
    title: 'Distant Horizons',
    role: 'atmosphere',
    roleLabel: 'Дальность обзора',
    difficulty: 'Средне',
    diffColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    summary: 'Показывает очень далёкий рельеф в упрощённом виде.',
    startGuide: 'Если FPS низкий, уменьшите дальность Distant Horizons.',
    keywords: ['дальность', 'горизонт', 'fps', 'distant horizons'],
    details: [
      'Рендерит далёкий ландшафт в упрощённом виде (LOD) без сильной нагрузки на ванильные чанки.'
    ]
  },
  {
    id: 'iris',
    title: 'Iris',
    role: 'atmosphere',
    roleLabel: 'Шейдеры',
    difficulty: 'Средне',
    diffColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    summary: 'Шейдеры.',
    startGuide: 'Если FPS низкий, отключите шейдеры.',
    keywords: ['шейдеры', 'графика', 'fps', 'iris'],
    details: [
      'Поддержка шейдерпаков для улучшения графики.'
    ]
  },
  {
    id: 'iris-shader-folder',
    title: 'Iris Shader Folder',
    role: 'atmosphere',
    roleLabel: 'Шейдеры',
    difficulty: 'Просто',
    diffColor: 'bg-green-500/20 text-green-400 border-green-500/30',
    summary: 'Удобная работа с папкой шейдеров.',
    startGuide: 'Используется при работе с шейдерпаками в Iris.',
    keywords: ['iris', 'шейдеры', 'папка'],
    details: [
      'Упрощает управление папкой шейдеров.'
    ]
  },
  {
    id: 'iris-search',
    title: 'IrisSearch',
    role: 'atmosphere',
    roleLabel: 'Шейдеры',
    difficulty: 'Просто',
    diffColor: 'bg-green-500/20 text-green-400 border-green-500/30',
    summary: 'Поиск в меню Iris.',
    startGuide: 'Используйте поиск в меню настроек шейдеров Iris.',
    keywords: ['iris', 'поиск', 'шейдеры'],
    details: [
      'Добавляет строку поиска в интерфейс Iris.'
    ]
  },
  {
    id: 'iris-flywheel-compat',
    title: 'Iris Flywheel Compat',
    role: 'atmosphere',
    roleLabel: 'Совместимость графики',
    difficulty: 'Служебный',
    diffColor: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    summary: 'Совместимость шейдеров с отрисовкой механизмов Create.',
    startGuide: 'Работает автоматически при совместном использовании Iris и Create.',
    keywords: ['iris', 'flywheel', 'create', 'шейдеры', 'совместимость'],
    details: [
      'Обеспечивает совместимость рендера Flywheel (Create) с шейдерами Iris.'
    ]
  },
  {
    id: 'ambient-sounds',
    title: 'AmbientSounds',
    role: 'atmosphere',
    roleLabel: 'Звуки окружения',
    difficulty: 'Просто',
    diffColor: 'bg-green-500/20 text-green-400 border-green-500/30',
    summary: 'Звуки окружающей среды.',
    startGuide: 'Добавляет фоновые звуки в разных местах и условиях.',
    keywords: ['звуки', 'окружение', 'атмосфера', 'ambientsounds'],
    details: [
      'Добавляет реалистичные фоновые звуки окружения.'
    ]
  },
  {
    id: 'sound-physics-remastered',
    title: 'Sound Physics Remastered',
    role: 'atmosphere',
    roleLabel: 'Физика звука',
    difficulty: 'Просто',
    diffColor: 'bg-green-500/20 text-green-400 border-green-500/30',
    summary: 'Реалистичное эхо и заглушение звуков.',
    startGuide: 'Звуки отражаются и приглушаются в зависимости от окружения и преград.',
    keywords: ['звук', 'эхо', 'заглушение', 'sound physics'],
    details: [
      'Добавляет акустику: эхо и приглушение звуковых эффектов.'
    ]
  },
  {
    id: 'not-enough-animations',
    title: 'Not Enough Animations',
    role: 'atmosphere',
    roleLabel: 'Анимации',
    difficulty: 'Просто',
    diffColor: 'bg-green-500/20 text-green-400 border-green-500/30',
    summary: 'Дополнительные анимации игрока и предметов.',
    startGuide: 'Добавляет плавные анимации от третьего лица.',
    keywords: ['анимации', 'игрок', 'предметы', 'animations'],
    details: [
      'Добавляет дополнительные анимации действий игрока и использования предметов.'
    ]
  },
  {
    id: 'ragdoll-deaths',
    title: 'Ragdoll Deaths',
    role: 'atmosphere',
    roleLabel: 'Физика тел',
    difficulty: 'Просто',
    diffColor: 'bg-green-500/20 text-green-400 border-green-500/30',
    summary: 'Тела падают по физике «тряпичной куклы».',
    startGuide: 'Визуальный эффект при гибели существ.',
    keywords: ['ragdoll', 'физика', 'смерть', 'анимация'],
    details: [
      'Применяет физику «тряпичной куклы» при падении тел после смерти.'
    ]
  },
  {
    id: 'simple-blood',
    title: 'Simple Blood',
    role: 'atmosphere',
    roleLabel: 'Эффекты боя',
    difficulty: 'Просто',
    diffColor: 'bg-green-500/20 text-green-400 border-green-500/30',
    summary: 'Эффекты крови.',
    startGuide: 'Визуальные эффекты при боях.',
    keywords: ['кровь', 'эффекты', 'бой', 'simple blood'],
    details: [
      'Добавляет визуальные эффекты крови.'
    ]
  },
  {
    id: 'bloody-particles',
    title: 'Bloody Particles',
    role: 'atmosphere',
    roleLabel: 'Частицы урона',
    difficulty: 'Просто',
    diffColor: 'bg-green-500/20 text-green-400 border-green-500/30',
    summary: 'Кровавые частицы при уроне.',
    startGuide: 'Частицы появляются при получении/нанесении урона.',
    keywords: ['частицы', 'урон', 'кровь', 'bloody particles'],
    details: [
      'Добавляет частицы при нанесении урона.'
    ]
  },

  // ================= 11. ТЕХНИЧЕСКИЕ МОДЫ И БИБЛИОТЕКИ =================
  // --- Оптимизация и диагностика ---
  {
    id: 'opt-sodium',
    title: 'Sodium',
    role: 'tech',
    roleLabel: 'Оптимизация и диагностика',
    difficulty: 'Технический',
    diffColor: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    summary: 'Повышает FPS. Игроку изучать не нужно, удалять не рекомендуется.',
    startGuide: 'Не удаляйте: часть оптимизации и зависимостей сборки.',
    keywords: ['оптимизация', 'fps', 'sodium', 'технический'],
    details: ['Повышает FPS. Игроку изучать не нужно.']
  },
  {
    id: 'opt-immediatelyfast',
    title: 'ImmediatelyFast',
    role: 'tech',
    roleLabel: 'Оптимизация и диагностика',
    difficulty: 'Технический',
    diffColor: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    summary: 'Повышает FPS. Игроку изучать не нужно.',
    startGuide: 'Работает автоматически.',
    keywords: ['оптимизация', 'fps', 'immediatelyfast', 'технический'],
    details: ['Повышает FPS за счёт оптимизации рендера.']
  },
  {
    id: 'opt-entity-culling',
    title: 'Entity Culling',
    role: 'tech',
    roleLabel: 'Оптимизация и диагностика',
    difficulty: 'Технический',
    diffColor: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    summary: 'Повышает FPS. Игроку изучать не нужно.',
    startGuide: 'Работает автоматически.',
    keywords: ['оптимизация', 'fps', 'entity culling', 'технический'],
    details: ['Повышает FPS, пропуская отрисовку скрытых сущностей.']
  },
  {
    id: 'opt-more-culling',
    title: 'More Culling',
    role: 'tech',
    roleLabel: 'Оптимизация и диагностика',
    difficulty: 'Технический',
    diffColor: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    summary: 'Повышает FPS. Игроку изучать не нужно.',
    startGuide: 'Работает автоматически.',
    keywords: ['оптимизация', 'fps', 'more culling', 'технический'],
    details: ['Повышает FPS за счёт дополнительной отсечки рендера.']
  },
  {
    id: 'opt-lithium',
    title: 'Lithium',
    role: 'tech',
    roleLabel: 'Оптимизация и диагностика',
    difficulty: 'Технический',
    diffColor: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    summary: 'Ускоряет игровую логику. Игроку изучать не нужно.',
    startGuide: 'Работает автоматически.',
    keywords: ['оптимизация', 'логика', 'lithium', 'технический'],
    details: ['Ускоряет игровую логику без изменения механик.']
  },
  {
    id: 'opt-ferritecore',
    title: 'FerriteCore',
    role: 'tech',
    roleLabel: 'Оптимизация и диагностика',
    difficulty: 'Технический',
    diffColor: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    summary: 'Память, загрузка и производительность. Игроку изучать не нужно.',
    startGuide: 'Работает автоматически.',
    keywords: ['оптимизация', 'память', 'ferritecore', 'технический'],
    details: ['Снижает потребление оперативной памяти и улучшает производительность.']
  },
  {
    id: 'opt-modernfix',
    title: 'ModernFix',
    role: 'tech',
    roleLabel: 'Оптимизация и диагностика',
    difficulty: 'Технический',
    diffColor: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    summary: 'Память, загрузка и производительность. Игроку изучать не нужно.',
    startGuide: 'Работает автоматически.',
    keywords: ['оптимизация', 'память', 'загрузка', 'modernfix', 'технический'],
    details: ['Улучшает время загрузки, потребление памяти и общую производительность.']
  },
  {
    id: 'opt-badoptimizations',
    title: 'BadOptimizations',
    role: 'tech',
    roleLabel: 'Оптимизация и диагностика',
    difficulty: 'Технический',
    diffColor: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    summary: 'Память, загрузка и производительность. Игроку изучать не нужно.',
    startGuide: 'Работает автоматически.',
    keywords: ['оптимизация', 'производительность', 'badoptimizations', 'технический'],
    details: ['Убирает лишние вычисления и повышает производительность.']
  },
  {
    id: 'opt-dynamic-fps',
    title: 'Dynamic FPS',
    role: 'tech',
    roleLabel: 'Оптимизация и диагностика',
    difficulty: 'Технический',
    diffColor: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    summary: 'Снижает нагрузку, когда окно игры неактивно.',
    startGuide: 'Работает в фоне при свёрнутом или неактивном окне игры.',
    keywords: ['оптимизация', 'fps', 'фон', 'dynamic fps', 'технический'],
    details: ['Снижает нагрузку, когда окно игры неактивно.']
  },
  {
    id: 'opt-spark',
    title: 'spark',
    role: 'tech',
    roleLabel: 'Диагностика (Для админа)',
    difficulty: 'Технический',
    diffColor: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    summary: 'Для админа: помогает найти причину лагов.',
    startGuide: 'Используется администратором для профилирования и поиска лагов.',
    keywords: ['диагностика', 'лаги', 'админ', 'spark', 'технический'],
    details: ['Инструмент диагностики производительности для администратора сервера.']
  },

  // --- Библиотеки: Общие основы ---
  ...[
    'Architectury', 'Balm', 'Kotlin for Forge', 'Forgified Fabric API', 'Resourceful Lib',
    'Common Storage Lib', 'Platform', 'CreativeCore', 'Konkrete', 'GabouLibs',
    'Seamless API', 'CodxLib', 'Baguette Lib', 'TenshiLib'
  ].map((libName, idx) => ({
    id: `lib-core-${idx}`,
    title: libName,
    role: 'tech',
    roleLabel: 'Библиотека • Общие основы',
    difficulty: 'Библиотека',
    diffColor: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    summary: 'Библиотека (общие основы). Не удаляйте: без библиотек другие моды не запустятся.',
    startGuide: 'Игроку изучать не нужно.',
    keywords: ['библиотека', 'общие основы', libName.toLowerCase(), 'технический'],
    details: ['Техническая библиотека из группы «Общие основы». Не удаляйте её.']
  })),
  {
    id: 'lib-quantified-api',
    title: 'Quantified API',
    role: 'tech',
    roleLabel: 'Библиотека • Общие основы',
    difficulty: 'Уточнить',
    needsClarification: true,
    diffColor: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    summary: 'Библиотека (общие основы) — помечена как (уточнить). Не удаляйте.',
    startGuide: 'Игроку изучать не нужно.',
    keywords: ['библиотека', 'quantified api', 'уточнить', 'технический'],
    details: ['Библиотека из раздела «Общие основы» со статусом (уточнить).']
  },

  // --- Библиотеки: Настройки и меню ---
  ...[
    'Cloth Config', 'YACL (yet_another_config_lib)', 'Fzzy Config',
    'Resourceful Config', 'mezz_config', 'Searchables', 'libIPN'
  ].map((libName, idx) => ({
    id: `lib-cfg-${idx}`,
    title: libName,
    role: 'tech',
    roleLabel: 'Библиотека • Настройки и меню',
    difficulty: 'Библиотека',
    diffColor: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    summary: 'Библиотека для настроек и меню. Не удаляйте.',
    startGuide: 'Игроку изучать не нужно.',
    keywords: ['библиотека', 'настройки', 'меню', libName.toLowerCase(), 'технический'],
    details: ['Техническая библиотека для экранов настроек и меню.']
  })),

  // --- Библиотеки: Анимации и эффекты ---
  ...['GeckoLib', 'AzureLib', 'Player Animation Lib', 'Lodestone'].map((libName, idx) => ({
    id: `lib-anim-${idx}`,
    title: libName,
    role: 'tech',
    roleLabel: 'Библиотека • Анимации и эффекты',
    difficulty: 'Библиотека',
    diffColor: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    summary: 'Библиотека для анимаций и эффектов. Не удаляйте.',
    startGuide: 'Игроку изучать не нужно.',
    keywords: ['библиотека', 'анимации', 'эффекты', libName.toLowerCase(), 'технический'],
    details: ['Техническая библиотека для анимаций и визуальных эффектов.']
  })),

  // --- Библиотеки: ИИ мобов ---
  {
    id: 'lib-smartbrainlib',
    title: 'SmartBrainLib',
    role: 'tech',
    roleLabel: 'Библиотека • ИИ мобов',
    difficulty: 'Библиотека',
    diffColor: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    summary: 'Библиотека для ИИ мобов. Не удаляйте.',
    startGuide: 'Игроку изучать не нужно.',
    keywords: ['библиотека', 'ии мобов', 'smartbrainlib', 'технический'],
    details: ['Техническая библиотека логики ИИ мобов.']
  },

  // --- Библиотеки: Магия и книги ---
  ...["Iron's Lib", "Ace's Spell Utils", 'Modonomicon', 'OctoLib'].map((libName, idx) => ({
    id: `lib-magic-${idx}`,
    title: libName,
    role: 'tech',
    roleLabel: 'Библиотека • Магия и книги',
    difficulty: 'Библиотека',
    diffColor: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    summary: 'Библиотека для магии и внутриигровых книг. Не удаляйте.',
    startGuide: 'Игроку изучать не нужно.',
    keywords: ['библиотека', 'магия', 'книги', libName.toLowerCase(), 'технический'],
    details: ['Техническая библиотека для магических модов и книг.']
  })),

  // --- Библиотеки: Дополнения к еде ---
  ...['DelightLib', "Let's Do: Foundation"].map((libName, idx) => ({
    id: `lib-food-${idx}`,
    title: libName,
    role: 'tech',
    roleLabel: 'Библиотека • Дополнения к еде',
    difficulty: 'Библиотека',
    diffColor: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    summary: 'Библиотека для дополнений к еде и фермерству. Не удаляйте.',
    startGuide: 'Игроку изучать не нужно.',
    keywords: ['библиотека', 'еда', libName.toLowerCase(), 'технический'],
    details: ['Техническая библиотека для модов на еду и готовку.']
  })),

  // --- Библиотеки: Декор, сезоны, мир ---
  ...['Moonlight', 'Zeta', 'Framework', 'GlitchCore', 'Lithostitched'].map((libName, idx) => ({
    id: `lib-world-${idx}`,
    title: libName,
    role: 'tech',
    roleLabel: 'Библиотека • Декор, сезоны, мир',
    difficulty: 'Библиотека',
    diffColor: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    summary: 'Библиотека для декора, сезонов и генерации мира. Не удаляйте.',
    startGuide: 'Игроку изучать не нужно.',
    keywords: ['библиотека', 'декор', 'сезоны', 'мир', libName.toLowerCase(), 'технический'],
    details: ['Техническая библиотека для декора, сезонов и мира.']
  })),

  // --- Библиотеки: Интерактивные блоки Hands-On ---
  {
    id: 'lib-diegesis',
    title: 'Diegesis',
    role: 'tech',
    roleLabel: 'Библиотека • Интерактивные блоки Hands-On',
    difficulty: 'Библиотека',
    diffColor: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    summary: 'Библиотека для интерактивных блоков Hands-On. Не удаляйте.',
    startGuide: 'Игроку изучать не нужно.',
    wikiUrl: 'https://www.curseforge.com/minecraft/mc-mods/diegesis',
    keywords: ['библиотека', 'hands-on', 'diegesis', 'технический'],
    details: ['Техническая библиотека, поддерживающая интерактивные механики Hands-On.']
  },

  // --- Не опознаны ---
  {
    id: 'unrec-neoforge-jar',
    title: 'neoforge-1.21.1-1.1.0.jar',
    role: 'tech',
    roleLabel: 'Не опознан',
    difficulty: 'Уточнить',
    needsClarification: true,
    diffColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    summary: 'Имя файла не содержит названия мода (уточнить).',
    startGuide: 'Проверьте название и автора в меню Mods или внутри jar в META-INF/neoforge.mods.toml.',
    keywords: ['не опознан', 'neoforge-1.21.1-1.1.0.jar', 'уточнить', 'jar'],
    details: [
      'Имя файла не содержит названия мода — требуется уточнить (уточнить).',
      'Проверьте в меню Mods или внутри jar в META-INF/neoforge.mods.toml.'
    ]
  },
  {
    id: 'unrec-dtrchneo-jar',
    title: 'dtrchneo-1.0.6-neoforge-1.21.1.jar',
    role: 'tech',
    roleLabel: 'Не опознан',
    difficulty: 'Уточнить',
    needsClarification: true,
    diffColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    summary: 'Назначение не найдено (уточнить).',
    startGuide: 'Проверьте название и автора в меню Mods или внутри jar в META-INF/neoforge.mods.toml.',
    keywords: ['не опознан', 'dtrchneo-1.0.6-neoforge-1.21.1.jar', 'уточнить', 'jar'],
    details: [
      'Назначение не найдено — требуется уточнить (уточнить).',
      'Проверьте в меню Mods или внутри jar в META-INF/neoforge.mods.toml.'
    ]
  }
];

const FAQS = [
  {
    q: 'Я умер! Где мои вещи и как их вернуть?',
    a: 'Благодаря моду Corpse, после смерти вещи остаются в «теле»: вернитесь к месту гибели и заберите их. Дополнительно Corpse x Curios Compat сохраняет работу аксессуаров из слотов Curios вместе с телом.'
  },
  {
    q: 'Как пользоваться Камнями Телепортации (Waystones)?',
    a: 'Найдите камень телепортации (Waystone) и кликните по нему, чтобы активировать. После этого вы сможете перемещаться между активированными точками.'
  },
  {
    q: 'Как настроить Голосовой Чат (Plasmo Voice)?',
    a: 'Настройте голосовой чат (по умолчанию клавиша V). Чат работает по расстоянию — слышно тех, кто рядом, а с дополнениями добавляются эхо, приглушение за стенами и рации.'
  },
  {
    q: 'Что делать, если зомби слишком опасны?',
    a: 'В сборке есть Zombie Apocalypse Addon, Born in Chaos, Improved Mobs и Hostile Tactics. Делайте дом, броню и еду, освещайте территорию, а если друзьям тяжело — админ может использовать /za preset casual.'
  },
  {
    q: 'Почему нельзя ломать сундуки в структурах (Lootr)?',
    a: 'Мод Lootr делает лут в найденных сундуках индивидуальным для каждого игрока. Не ломайте такие сундуки, иначе другим игрокам не хватит добычи.'
  },
  {
    q: 'Что делать, если просел FPS?',
    a: 'Сначала отключите шейдеры (Iris) и уменьшите дальность Distant Horizons.'
  }
];

const ADMIN_NOTES = [
  'Списки клиента и сервера полностью совпадают: в каждом 163 файла.',
  'Клиентские моды на сервере: Sodium, Iris, Dynamic FPS, Xaero\'s Minimap и подобные серверу, как правило, не нужны. Если всё работает, срочно менять ничего не надо — убирайте по одному и проверяйте запуск.',
  'Физика кораблей: вместе стоят Valkyrien Skies и Sable. В описании неофициального форка упомянуто исправление конфликта коллизий с Sable — корабли стоит протестировать (желательно на копии мира с тестовым судном).',
  'Неофициальные порты: об ошибках Valkyrien Skies и Eureka не пишите оригинальным авторам — это сборки сторонних разработчиков.',
  'Сложность: одновременно стоят Improved Mobs, Hostile Tactics и Zombie Apocalypse Addon. Если друзьям тяжело, начните с пресета /za preset casual (нужны права оператора) и сверьтесь с /za.'
];

const ADMIN_CHECKLIST = [
  'Проверить в игре моды с пометкой (уточнить). Название и автор есть в меню Mods или внутри jar в META-INF/neoforge.mods.toml.',
  'Проверить клавиши и первые рецепты.',
  'Решить, какие правила сервера нужны: мины, оружие, чужие сундуки, экономика.'
];

// --- MAIN APP COMPONENT ---
export default function App() {
  const [selectedRole, setSelectedRole] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyClarify, setOnlyClarify] = useState(false);
  const [activeModModal, setActiveModModal] = useState(null);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [activeTab, setActiveTab] = useState('mods'); // 'mods', 'quickstart', 'faq', 'admin'

  // Безопасная инициализация Telegram WebApp SDK
  useEffect(() => {
    try {
      const twa = window?.Telegram?.WebApp;
      if (twa) {
        if (typeof twa.ready === 'function') twa.ready();
        if (typeof twa.expand === 'function') twa.expand();
      }
    } catch {
      // Игнорируем, если открыто вне Telegram
    }
  }, []);

  // Фильтрация модов по категории, метке "(уточнить)" и поисковому запросу
  const filteredMods = useMemo(() => {
    return MODS_DATA.filter(mod => {
      const matchesRole = selectedRole === 'all' || mod.role === selectedRole;
      const matchesClarify = !onlyClarify || Boolean(mod.needsClarify || mod.needsClarification);
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        mod.title.toLowerCase().includes(q) ||
        mod.summary.toLowerCase().includes(q) ||
        mod.roleLabel.toLowerCase().includes(q) ||
        mod.keywords.some(k => k.toLowerCase().includes(q));
      
      return matchesRole && matchesClarify && matchesSearch;
    });
  }, [selectedRole, searchQuery, onlyClarify]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-purple-500 selection:text-white pb-20">
      
      {/* BACKGROUND DECORATION */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 pt-4">

        {/* APP HEADER */}
        <header className="mb-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 p-4 backdrop-blur-xl shadow-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/20 ring-1 ring-white/20">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
                NeoForge 1.21.1 Guide
              </h1>
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Сервер для друзей • 160+ модов
              </p>
            </div>
          </div>
          <a
            href="https://wiki.createmod.net/"
            target="_blank"
            rel="noreferrer"
            className="text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-2 rounded-lg border border-slate-700/50 transition flex items-center gap-1"
          >
            Wiki <ExternalLink className="w-3 h-3" />
          </a>
        </header>

        {/* NAVIGATION TABS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 mb-6 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
          <button
            onClick={() => setActiveTab('mods')}
            className={`py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
              activeTab === 'mods' 
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <BookOpen className="w-4 h-4" /> Моды ({MODS_DATA.length})
          </button>
          <button
            onClick={() => setActiveTab('quickstart')}
            className={`py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
              activeTab === 'quickstart' 
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Zap className="w-4 h-4" /> День 1
          </button>
          <button
            onClick={() => setActiveTab('faq')}
            className={`py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
              activeTab === 'faq' 
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <HelpCircle className="w-4 h-4" /> FAQ
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
              activeTab === 'admin' 
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Wrench className="w-4 h-4" /> Админу
          </button>
        </div>

        {/* TAB 1: MODS BROWSER */}
        {activeTab === 'mods' && (
          <div className="space-y-5">
            {/* SEARCH BAR */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Поиск по всем модам, библиотекам и .jar (например: корабль, зомби, sodium, уточнить)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-300 bg-slate-800 rounded-full p-1"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* ROLE FILTER BUTTONS + CLARIFY FILTER */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none flex-1">
                {ROLES.map((r) => {
                  const Icon = r.icon;
                  const isSelected = selectedRole === r.id;
                  return (
                    <button
                      key={r.id}
                      onClick={() => setSelectedRole(r.id)}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition border ${
                        isSelected
                          ? `bg-gradient-to-r ${r.color} text-white border-transparent shadow-lg`
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {r.label}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setOnlyClarify((prev) => !prev)}
                className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition border shrink-0 mb-2 ${
                  onlyClarify
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                Только «уточнить»
              </button>
            </div>

            <div className="text-xs text-slate-400 flex items-center justify-between px-1">
              <span>Найдено записей: <strong className="text-slate-200">{filteredMods.length}</strong></span>
              <span className="text-[11px] text-slate-500">Клавиши в гайде стандартные, могут быть изменены</span>
            </div>

            {/* MODS GRID */}
            {filteredMods.length === 0 ? (
              <div className="text-center py-12 bg-slate-900/40 rounded-2xl border border-slate-800">
                <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-3 opacity-80" />
                <p className="text-slate-300 font-medium text-sm">Ничего не найдено</p>
                <p className="text-slate-500 text-xs mt-1">Попробуйте изменить поисковый запрос или фильтр</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredMods.map((mod) => (
                  <div
                    key={mod.id}
                    onClick={() => setActiveModModal(mod)}
                    className="group relative bg-slate-900/70 hover:bg-slate-900 border border-slate-800/80 hover:border-purple-500/40 rounded-2xl p-4 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-purple-500/5 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-bold text-slate-100 group-hover:text-purple-300 transition text-base break-words">
                          {mod.title}
                        </h3>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border shrink-0 ${mod.diffColor}`}>
                          {mod.difficulty}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                        {mod.summary}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-800/60 text-xs">
                      <span className="text-slate-500 flex items-center gap-1 font-medium text-[11px]">
                        <TagIcon className="w-3 h-3 text-purple-400" /> {mod.roleLabel}
                      </span>
                      <span className="text-purple-400 group-hover:translate-x-1 transition font-medium flex items-center gap-1 text-[11px]">
                        Подробнее &rarr;
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: DAY 1 QUICK START GUIDE */}
        {activeTab === 'quickstart' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-purple-900/40 via-slate-900 to-slate-900 border border-purple-500/30 rounded-2xl p-5 shadow-xl">
              <h2 className="text-base font-bold text-purple-200 flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                Первый день новичка
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Это большое приключенческое выживание для компании: магия, механизмы, корабли, новые миры, опасные монстры, кухня и стройка. Идти по всему сразу не нужно: выберите одно занятие, а с друзьями разделите роли.
              </p>
            </div>

            <div className="space-y-3">
              {[
                {
                  step: '1',
                  title: 'Инвентарь и JEI (R и U)',
                  icon: Key,
                  desc: 'Откройте инвентарь. Справа список предметов JEI: наведите на предмет и нажмите R (как сделать) или U (где используется).'
                },
                {
                  step: '2',
                  title: 'Jade сверху экрана',
                  icon: Info,
                  desc: 'Наведите прицел на любой блок или моба: Jade сверху покажет, что это.'
                },
                {
                  step: '3',
                  title: 'Управление и Controlling',
                  icon: Settings,
                  desc: 'Загляните в настройки управления. Клавиш от модов много, а поиск там добавляет Controlling.'
                },
                {
                  step: '4',
                  title: 'Укрытие, сон и еда',
                  icon: Skull,
                  desc: 'Сделайте дом, кровать или спальник и еду. Ночью и даже днём бывает опасно из-за зомби-аддона.'
                },
                {
                  step: '5',
                  title: 'Камень телепортации (Waystone)',
                  icon: MapPin,
                  desc: 'Найдите камень телепортации (Waystone) и кликните по нему, чтобы активировать.'
                },
                {
                  step: '6',
                  title: 'Голосовой чат Plasmo Voice (V)',
                  icon: Radio,
                  desc: 'Настройте голосовой чат Plasmo Voice (по умолчанию клавиша V).'
                }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.step} className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex gap-3.5 items-start">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-200 mb-1">{item.title}</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: FAQ ACCORDION */}
        {/* TAB 4: ADMIN NOTES & CHECKLIST */}
        {activeTab === 'admin' && (
          <div className="space-y-4">
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-xl">
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2 mb-2">
                <Server className="w-5 h-5 text-purple-400" />
                Заметки для админа и веб-приложения
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Списки клиента и сервера полностью совпадают: в каждом 163 файла. Ниже собраны ключевые нюансы по совместимости, сложности и подготовке сервера.
              </p>
            </div>

            <div className="space-y-2.5">
              {ADMIN_NOTES.map((note, index) => (
                <div key={index} className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-300 leading-relaxed">{note}</p>
                </div>
              ))}
            </div>

            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Что уточнить перед публикацией
              </h3>
              <ul className="space-y-2.5">
                {ADMIN_CHECKLIST.map((item, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start gap-2.5">
                    <span className="w-4 h-4 rounded border border-slate-600 inline-flex items-center justify-center text-[10px] text-slate-400 shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* MOD DETAIL MODAL */}
        {activeModModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
            <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-5 shadow-2xl relative">
              <button
                onClick={() => setActiveModModal(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800 rounded-full p-1.5 transition"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold border ${activeModModal.diffColor}`}>
                  {activeModModal.difficulty}
                </span>
                <span className="text-xs text-purple-400 font-medium">
                  {activeModModal.roleLabel}
                </span>
              </div>

              <h2 className="text-xl font-bold text-white mb-3">{activeModModal.title}</h2>

              <p className="text-xs text-slate-300 leading-relaxed mb-4 bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                {activeModModal.summary}
              </p>

              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" /> С чего начать:
                  </h4>
                  <p className="text-xs text-slate-300 bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl leading-relaxed">
                    {activeModModal.startGuide}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Особенности мода:</h4>
                  <ul className="space-y-2">
                    {activeModModal.details.map((detail, idx) => (
                      <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex gap-2">
                {activeModModal.wikiUrl && (
                  <a
                    href={activeModModal.wikiUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-purple-500/20"
                  >
                    Открыть Wiki / Страницу <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                <button
                  onClick={() => setActiveModModal(null)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium py-2.5 px-4 rounded-xl text-xs transition"
                >
                  Закрыть
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// Helper Tag Icon Component
function TagIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
  );
}
