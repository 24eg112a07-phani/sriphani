/**
 * QuizPulse Elite - Curated Questions Database
 * 50+ diverse, verified, and challenging questions across 5 categories
 */

const QUIZ_CATEGORIES = [
  {
    id: 'web-dev',
    name: 'Web Dev & Coding',
    icon: '💻',
    description: 'JavaScript, CSS, HTML5, React, Python and modern system architectures.',
    color: '#6366f1',
    gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)'
  },
  {
    id: 'science-tech',
    name: 'Science & AI',
    icon: '🚀',
    description: 'Astrophysics, Quantum Mechanics, Artificial Intelligence, and Robotics.',
    color: '#06b6d4',
    gradient: 'linear-gradient(135deg, #06b6d4, #3b82f6)'
  },
  {
    id: 'history-geo',
    name: 'History & World',
    icon: '🌍',
    description: 'Ancient civilizations, world wonders, empires, and global geography.',
    color: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981, #059669)'
  },
  {
    id: 'pop-culture',
    name: 'Pop Culture & Cinema',
    icon: '🎬',
    description: 'Oscar-winning movies, iconic music albums, gaming lore, and television.',
    color: '#ec4899',
    gradient: 'linear-gradient(135deg, #ec4899, #f43f5e)'
  },
  {
    id: 'general-knowledge',
    name: 'Logic & General Brain',
    icon: '🧠',
    description: 'Mind benders, lateral thinking, world records, and general trivia.',
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b, #d97706)'
  }
];

const DEFAULT_QUESTIONS = [
  // --- WEB DEV & CODING ---
  {
    id: 'wd-1',
    category: 'web-dev',
    difficulty: 'easy',
    type: 'single',
    question: 'Which of the following is NOT a JavaScript primitive data type?',
    options: ['String', 'Boolean', 'Object', 'Symbol'],
    correct: 2,
    explanation: 'In JavaScript, primitive types are string, number, bigint, boolean, undefined, symbol, and null. Object is a non-primitive reference type.'
  },
  {
    id: 'wd-2',
    category: 'web-dev',
    difficulty: 'medium',
    type: 'code',
    question: 'What is the output of the following JavaScript snippet?',
    code: 'console.log(typeof NaN);\nconsole.log(NaN === NaN);',
    options: [
      '"number" and true',
      '"number" and false',
      '"undefined" and false',
      '"nan" and true'
    ],
    correct: 1,
    explanation: 'In JavaScript, NaN stands for "Not-a-Number", but its typeof is still "number". Furthermore, IEEE 754 specifies that NaN is unequal to any value, including itself.'
  },
  {
    id: 'wd-3',
    category: 'web-dev',
    difficulty: 'medium',
    type: 'single',
    question: 'In the CSS Box Model, which property controls the space between the border and the content box?',
    options: ['Margin', 'Padding', 'Outline', 'Gap'],
    correct: 1,
    explanation: 'Padding provides inner spacing between the element’s content and its border. Margin provides spacing outside the border.'
  },
  {
    id: 'wd-4',
    category: 'web-dev',
    difficulty: 'hard',
    type: 'code',
    question: 'What will be printed to the console?',
    code: 'const a = [1, 2, 3];\nconst b = a;\nb.push(4);\nconsole.log(a.length, b.length);',
    options: ['3 4', '4 4', '4 3', 'Error thrown'],
    correct: 1,
    explanation: 'In JavaScript, arrays are assigned by reference. Both `a` and `b` reference the same underlying array memory address, so pushing to `b` alters `a`.'
  },
  {
    id: 'wd-5',
    category: 'web-dev',
    difficulty: 'hard',
    type: 'single',
    question: 'What does the HTTP 429 Status Code specifically indicate?',
    options: [
      'Bad Request Syntax',
      'Payment Required',
      'Too Many Requests (Rate Limited)',
      'Gateway Timeout'
    ],
    correct: 2,
    explanation: 'HTTP 429 Too Many Requests indicates the client has sent too many requests in a given amount of time (rate limiting).'
  },
  {
    id: 'wd-6',
    category: 'web-dev',
    difficulty: 'easy',
    type: 'single',
    question: 'Which HTML5 element is used to specify a footer for a document or section?',
    options: ['<bottom>', '<section-end>', '<footer>', '<subhead>'],
    correct: 2,
    explanation: 'The semantic <footer> tag defines a footer for a document or section in HTML5.'
  },
  {
    id: 'wd-7',
    category: 'web-dev',
    difficulty: 'medium',
    type: 'single',
    question: 'In modern CSS, what function allows you to calculate values dynamically, such as "width: calc(100% - 40px)"?',
    options: ['compute()', 'calc()', 'eval()', 'math()'],
    correct: 1,
    explanation: 'The CSS calc() function performs calculations to determine CSS property values dynamically across mixed units.'
  },
  {
    id: 'wd-8',
    category: 'web-dev',
    difficulty: 'medium',
    type: 'single',
    question: 'Which git command is used to record changes to the repository with a descriptive message?',
    options: ['git push -m', 'git save -m', 'git commit -m', 'git stage -m'],
    correct: 2,
    explanation: 'git commit -m "message" captures a snapshot of the project’s currently staged changes.'
  },
  {
    id: 'wd-9',
    category: 'web-dev',
    difficulty: 'hard',
    type: 'code',
    question: 'What is the evaluation order of this JavaScript expression?',
    code: 'console.log(1 + "2" + 3);',
    options: ['"123"', '6', '"33"', '"15"'],
    correct: 0,
    explanation: '1 + "2" performs string coercion yielding "12", then "12" + 3 performs string concatenation yielding "123".'
  },
  {
    id: 'wd-10',
    category: 'web-dev',
    difficulty: 'easy',
    type: 'single',
    question: 'What does CSS stand for?',
    options: [
      'Cascading Style Sheets',
      'Computer Screen Styles',
      'Creative Software Syntax',
      'Colorful System Sheets'
    ],
    correct: 0,
    explanation: 'CSS stands for Cascading Style Sheets, defining how HTML elements are to be displayed.'
  },

  // --- SCIENCE & AI ---
  {
    id: 'st-1',
    category: 'science-tech',
    difficulty: 'easy',
    type: 'single',
    question: 'What is the primary gas that makes up approximately 78% of the Earth’s atmosphere?',
    options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Argon'],
    correct: 1,
    explanation: 'Nitrogen gas (N2) accounts for roughly 78.08% of Earth’s atmosphere, followed by Oxygen at around 20.95%.'
  },
  {
    id: 'st-2',
    category: 'science-tech',
    difficulty: 'medium',
    type: 'single',
    question: 'What does the "T" stand for in the widely used Transformer architecture in AI (e.g. GPT)?',
    options: ['Translation', 'Transformer', 'Tensor', 'Transcription'],
    correct: 1,
    explanation: 'GPT stands for "Generative Pre-trained Transformer", based on the landmark 2017 paper "Attention Is All You Need".'
  },
  {
    id: 'st-3',
    category: 'science-tech',
    difficulty: 'hard',
    type: 'single',
    question: 'What physical boundary around a black hole marks the threshold where escape velocity exceeds the speed of light?',
    options: ['Accretion Disk', 'Ergosphere', 'Event Horizon', 'Photon Sphere'],
    correct: 2,
    explanation: 'The Event Horizon is the boundary beyond which nothing—not even electromagnetic radiation like light—can escape.'
  },
  {
    id: 'st-4',
    category: 'science-tech',
    difficulty: 'easy',
    type: 'single',
    question: 'What is the speed of light in a vacuum (approximate)?',
    options: ['30,000 km/s', '300,000 km/s', '3,000,000 km/s', '300 km/s'],
    correct: 1,
    explanation: 'The speed of light in a vacuum (c) is precisely 299,792,458 meters per second, or about 300,000 km/s.'
  },
  {
    id: 'st-5',
    category: 'science-tech',
    difficulty: 'medium',
    type: 'single',
    question: 'Which subatomic particles are found in the nucleus of an atom?',
    options: [
      'Protons and Electrons',
      'Protons and Neutrons',
      'Neutrons and Photons',
      'Electrons and Quarks only'
    ],
    correct: 1,
    explanation: 'The atomic nucleus consists of nucleons, which are positively charged protons and electrically neutral neutrons.'
  },
  {
    id: 'st-6',
    category: 'science-tech',
    difficulty: 'hard',
    type: 'single',
    question: 'In quantum mechanics, which principle states that you cannot simultaneously measure both position and momentum with arbitrary precision?',
    options: [
      'Pauli Exclusion Principle',
      'Heisenberg Uncertainty Principle',
      'Schrödinger Wave Equation',
      'Planck Quantum Limit'
    ],
    correct: 1,
    explanation: 'Werner Heisenberg formulated the Uncertainty Principle in 1927, fundamentally bounding conjugate physical quantities.'
  },
  {
    id: 'st-7',
    category: 'science-tech',
    difficulty: 'medium',
    type: 'single',
    question: 'Which telescope was launched in December 2021 as the successor to the Hubble Space Telescope?',
    options: [
      'James Webb Space Telescope',
      'Kepler Observatory',
      'Spitzer Space Telescope',
      'Chandra X-ray Observatory'
    ],
    correct: 0,
    explanation: 'The James Webb Space Telescope (JWST) operates in the infrared spectrum at the Sun-Earth L2 Lagrange point.'
  },
  {
    id: 'st-8',
    category: 'science-tech',
    difficulty: 'easy',
    type: 'single',
    question: 'What is the chemical formula for ordinary table salt?',
    options: ['KCl', 'NaCl', 'CaCO3', 'NaHCO3'],
    correct: 1,
    explanation: 'Table salt is Sodium Chloride, chemical formula NaCl.'
  },
  {
    id: 'st-9',
    category: 'science-tech',
    difficulty: 'medium',
    type: 'single',
    question: 'Which machine learning concept penalizes complex models to avoid overfitting (e.g. L1/L2)?',
    options: ['Backpropagation', 'Regularization', 'Gradient Descent', 'Tokenization'],
    correct: 1,
    explanation: 'Regularization (like Lasso L1 and Ridge L2) adds a penalty term to loss functions to discourage excessive model complexity.'
  },
  {
    id: 'st-10',
    category: 'science-tech',
    difficulty: 'hard',
    type: 'single',
    question: 'What is the unit of electrical capacitance in the SI system?',
    options: ['Henry', 'Weber', 'Farad', 'Tesla'],
    correct: 2,
    explanation: 'The Farad (symbol: F), named after Michael Faraday, is the SI unit of electrical capacitance.'
  },

  // --- HISTORY & WORLD ---
  {
    id: 'hg-1',
    category: 'history-geo',
    difficulty: 'easy',
    type: 'single',
    question: 'What is the capital city of Australia?',
    options: ['Sydney', 'Melbourne', 'Canberra', 'Brisbane'],
    correct: 2,
    explanation: 'Canberra was chosen as the compromise capital of Australia in 1908 between rivals Sydney and Melbourne.'
  },
  {
    id: 'hg-2',
    category: 'history-geo',
    difficulty: 'medium',
    type: 'single',
    question: 'In what year did the Apollo 11 mission land humans on the Moon?',
    options: ['1965', '1969', '1971', '1975'],
    correct: 1,
    explanation: 'On July 20, 1969, Neil Armstrong and Buzz Aldrin stepped onto the lunar surface.'
  },
  {
    id: 'hg-3',
    category: 'history-geo',
    difficulty: 'hard',
    type: 'single',
    question: 'Which ancient empire was ruled by Cyrus the Great and Darius I?',
    options: ['The Ottoman Empire', 'The Achaemenid (Persian) Empire', 'The Byzantine Empire', 'The Babylonian Empire'],
    correct: 1,
    explanation: 'The Achaemenid Empire, also known as the First Persian Empire, was founded by Cyrus the Great around 550 BC.'
  },
  {
    id: 'hg-4',
    category: 'history-geo',
    difficulty: 'easy',
    type: 'single',
    question: 'Which is the longest river in the world by general consensus?',
    options: ['Amazon River', 'Nile River', 'Yangtze River', 'Mississippi River'],
    correct: 1,
    explanation: 'The Nile River in Africa is traditionally recognized as the longest river in the world at approximately 6,650 km (4,132 miles).'
  },
  {
    id: 'hg-5',
    category: 'history-geo',
    difficulty: 'medium',
    type: 'single',
    question: 'Which treaty signed in 1919 officially brought an end to World War I?',
    options: ['Treaty of Ghent', 'Treaty of Versailles', 'Treaty of Utrecht', 'Treaty of Paris'],
    correct: 1,
    explanation: 'The Treaty of Versailles was signed on June 28, 1919, in the Hall of Mirrors in Versailles, France.'
  },
  {
    id: 'hg-6',
    category: 'history-geo',
    difficulty: 'hard',
    type: 'single',
    question: 'Which modern country was previously known as the ancient kingdom of Abyssinia?',
    options: ['Ethiopia', 'Somalia', 'Sudan', 'Eritrea'],
    correct: 0,
    explanation: 'Abyssinia was the historical name for the Ethiopian Empire, one of the oldest sovereign nations in Africa.'
  },
  {
    id: 'hg-7',
    category: 'history-geo',
    difficulty: 'medium',
    type: 'single',
    question: 'Which strait separates the continents of Asia and North America?',
    options: ['Gibraltar Strait', 'Bering Strait', 'Malacca Strait', 'Bosporus Strait'],
    correct: 1,
    explanation: 'The Bering Strait connects the Arctic Ocean with the Bering Sea, separating Russia (Asia) from Alaska (North America).'
  },
  {
    id: 'hg-8',
    category: 'history-geo',
    difficulty: 'easy',
    type: 'single',
    question: 'In which European city would you find the Colosseum?',
    options: ['Athens', 'Paris', 'Rome', 'Madrid'],
    correct: 2,
    explanation: 'The Colosseum is an iconic amphitheater situated in the heart of Rome, Italy, built under the Flavian emperors.'
  },
  {
    id: 'hg-9',
    category: 'history-geo',
    difficulty: 'hard',
    type: 'single',
    question: 'Who was the first woman to win a Nobel Prize and remains the only person to win in two different scientific fields?',
    options: ['Rosalind Franklin', 'Ada Lovelace', 'Marie Curie', 'Dorothy Hodgkin'],
    correct: 2,
    explanation: 'Marie Curie won the Nobel Prize in Physics (1903) and the Nobel Prize in Chemistry (1911).'
  },
  {
    id: 'hg-10',
    category: 'history-geo',
    difficulty: 'easy',
    type: 'single',
    question: 'How many continents are there on Earth according to the standard model?',
    options: ['5', '6', '7', '8'],
    correct: 2,
    explanation: 'The 7 continents are Africa, Antarctica, Asia, Australia/Oceania, Europe, North America, and South America.'
  },

  // --- POP CULTURE & CINEMA ---
  {
    id: 'pc-1',
    category: 'pop-culture',
    difficulty: 'easy',
    type: 'single',
    question: 'Who directed the 2010 mind-bending science fiction film "Inception"?',
    options: ['Steven Spielberg', 'Christopher Nolan', 'Denis Villeneuve', 'James Cameron'],
    correct: 1,
    explanation: 'Christopher Nolan wrote and directed "Inception", starring Leonardo DiCaprio.'
  },
  {
    id: 'pc-2',
    category: 'pop-culture',
    difficulty: 'medium',
    type: 'single',
    question: 'Which film won the Academy Award for Best Picture at the 92nd Oscars (2020), making history as the first non-English film to win?',
    options: ['1917', 'Parasite', 'Roma', 'The Irishman'],
    correct: 1,
    explanation: 'Bong Joon-ho’s South Korean masterpiece "Parasite" took home four Academy Awards including Best Picture.'
  },
  {
    id: 'pc-3',
    category: 'pop-culture',
    difficulty: 'easy',
    type: 'single',
    question: 'What is the fictional metal vibranium famously used for in Marvel Comics?',
    options: ['Thor’s hammer Mjolnir', 'Captain America’s Shield', 'Iron Man’s Arc Reactor', 'Wolverine’s Claws'],
    correct: 1,
    explanation: 'Captain America’s circular shield is made of a unique vibranium-steel alloy (or pure vibranium in the MCU), mined from Wakanda.'
  },
  {
    id: 'pc-4',
    category: 'pop-culture',
    difficulty: 'medium',
    type: 'single',
    question: 'Which video game franchise features the legendary protagonist "Master Chief"?',
    options: ['Doom', 'Halo', 'Gears of War', 'Mass Effect'],
    correct: 1,
    explanation: 'Master Chief Petty Officer John-117 is the cybernetically enhanced supersoldier hero of Bungie/343’s Halo franchise.'
  },
  {
    id: 'pc-5',
    category: 'pop-culture',
    difficulty: 'hard',
    type: 'single',
    question: 'Who composed the iconic musical score for "The Lord of the Rings" film trilogy?',
    options: ['Hans Zimmer', 'John Williams', 'Howard Shore', 'Ennio Morricone'],
    correct: 2,
    explanation: 'Canadian composer Howard Shore created the sweeping, leitmotif-rich score for Peter Jackson’s Lord of the Rings trilogy, winning 3 Oscars.'
  },
  {
    id: 'pc-6',
    category: 'pop-culture',
    difficulty: 'medium',
    type: 'single',
    question: 'Which legendary rock band released the 1973 album "The Dark Side of the Moon"?',
    options: ['Led Zeppelin', 'The Beatles', 'Pink Floyd', 'The Rolling Stones'],
    correct: 2,
    explanation: 'Pink Floyd released "The Dark Side of the Moon" in March 1973, spending a record 900+ weeks on the Billboard 200.'
  },
  {
    id: 'pc-7',
    category: 'pop-culture',
    difficulty: 'easy',
    type: 'single',
    question: 'In the animated series "The Simpsons", what is the name of Homer Simpson’s favorite beer?',
    options: ['Duff Beer', 'Pawtucket Ale', 'Buzz Cola', 'Flaming Moe'],
    correct: 0,
    explanation: 'Duff Beer is the ubiquitous brand enjoyed by Homer Simpson and served at Moe’s Tavern.'
  },
  {
    id: 'pc-8',
    category: 'pop-culture',
    difficulty: 'hard',
    type: 'single',
    question: 'What was the first feature-length computer-animated movie ever released?',
    options: ['A Bug’s Life', 'Toy Story', 'Shrek', 'Antz'],
    correct: 1,
    explanation: 'Pixar released "Toy Story" in November 1995, directed by John Lasseter, revolutionizing the animation industry.'
  },
  {
    id: 'pc-9',
    category: 'pop-culture',
    difficulty: 'medium',
    type: 'single',
    question: 'In HBO’s "Game of Thrones", what is the ancestral Valyrian steel sword of House Stark named?',
    options: ['Needle', 'Longclaw', 'Ice', 'Oathkeeper'],
    correct: 2,
    explanation: 'Ice was the greatsword of House Stark, wielded by Lord Eddard Stark in the series debut.'
  },
  {
    id: 'pc-10',
    category: 'pop-culture',
    difficulty: 'easy',
    type: 'single',
    question: 'Which company developed the world-renowned game "Minecraft"?',
    options: ['Epic Games', 'Mojang Studios', 'Valve', 'Roblox Corp'],
    correct: 1,
    explanation: 'Mojang Studios, founded by Markus "Notch" Persson in Sweden, created Minecraft (later acquired by Microsoft).'
  },

  // --- LOGIC & GENERAL BRAIN ---
  {
    id: 'gk-1',
    category: 'general-knowledge',
    difficulty: 'easy',
    type: 'single',
    question: 'How many keys does a standard full-size modern acoustic piano have?',
    options: ['76', '88', '92', '104'],
    correct: 1,
    explanation: 'A standard piano features 88 keys: 52 white keys for natural notes and 36 black keys for accidentals (sharps and flats).'
  },
  {
    id: 'gk-2',
    category: 'general-knowledge',
    difficulty: 'medium',
    type: 'single',
    question: 'A bat and a ball cost $1.10 in total. The bat costs $1.00 more than the ball. How much does the ball cost?',
    options: ['$0.10', '$0.05', '$0.15', '$0.01'],
    correct: 1,
    explanation: 'Let ball = x. Bat = x + 1.00. x + (x + 1.00) = 1.10 => 2x = 0.10 => x = $0.05. The ball costs 5 cents.'
  },
  {
    id: 'gk-3',
    category: 'general-knowledge',
    difficulty: 'medium',
    type: 'single',
    question: 'Which chess piece is the only piece capable of jumping over other pieces?',
    options: ['The Rook', 'The Bishop', 'The Knight', 'The Pawn'],
    correct: 2,
    explanation: 'The Knight moves in an "L-shape" (two squares in one direction and one perpendicular) and can leap over any intervening pieces.'
  },
  {
    id: 'gk-4',
    category: 'general-knowledge',
    difficulty: 'easy',
    type: 'single',
    question: 'What is the Roman numeral equivalent of the number 50?',
    options: ['C', 'D', 'L', 'M'],
    correct: 2,
    explanation: 'In Roman numerals: L = 50, C = 100, D = 500, M = 1000, X = 10, V = 5, I = 1.'
  },
  {
    id: 'gk-5',
    category: 'general-knowledge',
    difficulty: 'hard',
    type: 'single',
    question: 'Which of the following numbers is the smallest prime number?',
    options: ['0', '1', '2', '3'],
    correct: 2,
    explanation: 'By definition, a prime number is a natural number greater than 1 with no positive divisors other than 1 and itself. 2 is the smallest (and only even) prime.'
  },
  {
    id: 'gk-6',
    category: 'general-knowledge',
    difficulty: 'medium',
    type: 'single',
    question: 'What is the rarest natural eye color in the human population?',
    options: ['Blue', 'Green', 'Hazel', 'Amber'],
    correct: 1,
    explanation: 'Green eyes occur in only approximately 2% of the world population, making them the rarest natural eye color.'
  },
  {
    id: 'gk-7',
    category: 'general-knowledge',
    difficulty: 'easy',
    type: 'single',
    question: 'What is the freezing point of water at standard atmospheric pressure in Fahrenheit?',
    options: ['0°F', '32°F', '100°F', '212°F'],
    correct: 1,
    explanation: 'Water freezes at 0°C or 32°F at 1 atmosphere of pressure, and boils at 100°C or 212°F.'
  },
  {
    id: 'gk-8',
    category: 'general-knowledge',
    difficulty: 'hard',
    type: 'single',
    question: 'In probability, what is the chance of rolling two standard six-sided dice and getting a total sum of 7?',
    options: ['1 in 6 (16.67%)', '1 in 12 (8.33%)', '1 in 36 (2.78%)', '1 in 4 (25.0%)'],
    correct: 0,
    explanation: 'There are 36 total outcomes. 6 combinations sum to 7: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1). 6/36 = 1/6.'
  },
  {
    id: 'gk-9',
    category: 'general-knowledge',
    difficulty: 'medium',
    type: 'single',
    question: 'Which language currently has the highest number of native speakers worldwide?',
    options: ['English', 'Spanish', 'Mandarin Chinese', 'Hindi'],
    correct: 2,
    explanation: 'Mandarin Chinese has over 900 million native speakers, making it the most spoken native mother tongue globally.'
  },
  {
    id: 'gk-10',
    category: 'general-knowledge',
    difficulty: 'hard',
    type: 'single',
    question: 'What phenomenon causes a clock on a fast-moving spaceship to tick slower relative to a stationary observer?',
    options: ['Gravitational Lensing', 'Time Dilation', 'Doppler Shift', 'Entropy Decay'],
    correct: 1,
    explanation: 'According to Einstein’s Special Relativity, relative velocity between two observers results in time dilation for the moving frame.'
  }
];

// Helper to retrieve custom questions from localStorage
function getCombinedQuestions() {
  try {
    const custom = JSON.parse(localStorage.getItem('quizpulse_custom_questions') || '[]');
    if (Array.isArray(custom) && custom.length > 0) {
      return [...DEFAULT_QUESTIONS, ...custom];
    }
  } catch (e) {
    console.warn('Failed to load custom questions from localStorage', e);
  }
  return DEFAULT_QUESTIONS;
}
