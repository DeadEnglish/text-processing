const text: string =
	"lorem ipsum dolor sit amet consectetur lorem ipsum et mihi quoniam et adipiscing elit.sed quoniam et advesperascit et mihi ad villam revertendum est nunc quidem hactenus ex rebus enim timiditas non ex vocabulis nascitur.nummus in croesi divitiis obscuratur pars est tamen divitiarum.nam quibus rebus efficiuntur voluptates eae non sunt in potestate sapientis.hoc mihi cum tuo fratre convenit.qui ita affectus beatum esse numquam probabis duo reges constructio interrete.de hominibus dici non necesse est.eam si varietatem diceres intellegerem ut etiam non dicente te intellego parvi enim primo ortu sic iacent tamquam omnino sine animo sint.ea possunt paria non esse.quamquam tu hanc copiosiorem etiam soles dicere.de quibus cupio scire quid sentias.universa enim illorum ratione cum tota vestra confligendum puto.ut nemo dubitet eorum omnia officia quo spectare quid sequi quid fugere debeant nunc vero a primo quidem mirabiliter occulta natura est nec perspici nec cognosci potest.videmusne ut pueri ne verberibus quidem a contemplandis rebus perquirendisque deterreantur sunt enim prima elementa naturae quibus auctis virtutis quasi germen efficitur.nam ut sint illa vendibiliora haec uberiora certe sunt.cur deinde metrodori liberos commendas.mihi inquam qui te id ipsum rogavi nam adhuc meo fortasse vitio quid ego quaeram non perspicis.quibus ego vehementer assentior.cur iustitia laudatur mihi enim satis est ipsis non satis.quid est enim aliud esse versutum nobis heracleotes ille dionysius flagitiose descivisse videtur a stoicis propter oculorum dolorem.diodorus eius auditor adiungit ad honestatem vacuitatem doloris.nos quidem virtutes sic natae sumus ut tibi serviremus aliud negotii nihil habemus.";

const period: RegExp = /\./g;

// Helper functions
export const arrayOfWords = (text: string): string[] =>
	text
		.replace(period, " ")
		.split(" ")
		.filter((word) => word);

const arrayOfSenctances = (text: string): string[] =>
	text.split(".").filter((sentance) => sentance);

export const createWordCounterMap = (
	wordArray: string[]
): Map<string, number> => {
	let reoccuringWordCount: Map<string, number> = new Map<string, number>();

	// Loop through words and add to map
	wordArray.forEach((word) => {
		if (reoccuringWordCount.has(word)) {
			return reoccuringWordCount.set(
				word,
				reoccuringWordCount.get(word)! + 1
			);
		}
		return reoccuringWordCount.set(word, 1);
	});

	return reoccuringWordCount;
};

const xMapValueAsString = (map: Map<string, number>, x: number): string => {
	let valuesToReturn: string[] = [];
	const sortedMapKeys = map.keys();

	for (let i = 0; i < x; i++) {
		valuesToReturn.push(sortedMapKeys.next().value);
	}

	return valuesToReturn.join(", ");
};

const calculateWordProminence = (
	totalWords: number,
	positionSum: number,
	positionsNum: number
): number => {
	return (totalWords - (positionSum - 1) / positionsNum) * (100 / totalWords);
};

// Answer functions
const answerOne = (text: string): number => {
	return arrayOfWords(text).length;
};

const answerTwo = (text: string): number => {
	return arrayOfSenctances(text).length;
};

const answerThree = (text: string): number => {
	const wordArray = arrayOfWords(text).sort((a, b) => b.length - a.length);

	return wordArray[0].length;
};

const answerFour = (text: string): string => {
	const wordArray = arrayOfWords(text);

	const reoccuringWordCount = createWordCounterMap(wordArray);

	const sortedMap: Map<string, number> = new Map<string, number>(
		[...reoccuringWordCount.entries()].sort((a, b) => b[1] - a[1])
	);

	return xMapValueAsString(sortedMap, 6);
};

const answerFive = (text: string): string => {
	const wordArray = arrayOfWords(text);

	const reoccuringWordCount = createWordCounterMap(wordArray);

	// Delete if occured more than once
	for (let word of reoccuringWordCount.entries()) {
		if (word[1] > 1) {
			reoccuringWordCount.delete(word[0]);
		}
	}

	const percentageOfSingleWords =
		(reoccuringWordCount.size / wordArray.length) * 100;

	return `${percentageOfSingleWords.toFixed(2)}%`;
};

const answerSix = (text: string): number => {
	const sentancesArray = arrayOfSenctances(text);
	const sentanceLetterCount: number[] = [];

	sentancesArray.forEach((sentance) => {
		sentanceLetterCount.push(arrayOfWords(sentance).length);
	});

	const total = sentanceLetterCount.reduce((prev, curr) => prev + curr, 0);
	return Math.floor(total / sentancesArray.length);
};

// Question: should a word with a trailing period count the next word as a "two-word phrase"?
const answerSeven = (text: string): string => {
	const wordArray = arrayOfWords(text);
	let reoccuringWordCount: Map<string, number> = new Map<string, number>();

	wordArray.forEach((word, index) => {
		if (index === wordArray.length - 1) {
			return;
		}

		const wordPair = `${word} ${wordArray[index + 1]}`;

		if (reoccuringWordCount.has(wordPair)) {
			return reoccuringWordCount.set(
				wordPair,
				reoccuringWordCount.get(wordPair)! + 1
			);
		}
		return reoccuringWordCount.set(wordPair, 1);
	});

	const sortedMap: Map<string, number> = new Map<string, number>(
		[...reoccuringWordCount.entries()].sort((a, b) => b[1] - a[1])
	);

	return xMapValueAsString(sortedMap, 3);
};

// TODO: This may not be correct but I'm slightly over two hours
const bonusAnswer = (text: string): Record<string, number> => {
	const wordArray = arrayOfWords(text);
	const topFiveWords: string[] = [];
	const wordProminence: Record<string, number> = {};

	const reoccuringWordCount = createWordCounterMap(wordArray);

	const sortedMap: Map<string, number> = new Map<string, number>(
		[...reoccuringWordCount.entries()].sort((a, b) => b[1] - a[1])
	);

	const sortedMapKeys = sortedMap.keys();

	for (let i = 0; i < 5; i++) {
		const keyValue = sortedMapKeys.next().value;
		topFiveWords.push(keyValue);
		wordProminence[`${keyValue}`] = 0;
	}

	topFiveWords.forEach((word) => {
		let positionSum = 0;

		wordArray.forEach(
			(arrWord, index) =>
				arrWord === word && (positionSum = positionSum + index)
		);

		const prominence = calculateWordProminence(
			wordArray.length,
			positionSum,
			sortedMap.get(word)!
		);
		wordProminence[`${word}`] = prominence;
	});

	return wordProminence;
};

console.log("How many words are there in the text?: ", answerOne(text));
console.log("How many sentences are there in the text?: ", answerTwo(text));
console.log("What is the length of the longest word?: ", answerThree(text));
console.log("Which six words occur the most in the text?", answerFour(text));
console.log("What percentage of the words only occur once?:", answerFive(text));
console.log(
	"What is the average number of words per sentence?:",
	answerSix(text)
);
console.log(
	"Which three two-word phrases occur the most in the text?:",
	answerSeven(text)
);
console.log(
	"What is the prominence of the five words that occur the most in the text?:",
	bonusAnswer(text)
);
