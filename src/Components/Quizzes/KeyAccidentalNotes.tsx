import * as React from "react";

import * as FlashCardUtils from "../../Components/Quizzes/Utils";
import { FlashCard } from "../../FlashCard";
import { FlashCardGroup } from "../../FlashCardGroup";
import { AnswerDifficulty } from "../../StudyAlgorithm";

export function renderAnswerSelect(
  width: number, height: number,
  flashCards: FlashCard[],
  enabledFlashCardIndices: number[],
  areFlashCardsInverted: boolean,
  flashCardIndex: number,
  flashCard: FlashCard,
  onAnswer: (answerDifficulty: AnswerDifficulty, answer: any) => void,
  lastCorrectAnswer: any
): JSX.Element {
  const row0 = ["none"];
  const row1 = ["F♯", "F♯, C♯", "F♯, C♯, G♯", "F♯, C♯, G♯, D♯", "F♯, C♯, G♯, D♯, A♯", "F♯, C♯, G♯, D♯, A♯, E♯", "F♯, C♯, G♯, D♯, A♯, E♯, B♯"];
  const row2 = ["B♭", "B♭, E♭", "B♭, E♭, A♭", "B♭, E♭, A♭, D♭", "B♭, E♭, A♭, D♭, G♭", "B♭, E♭, A♭, D♭, G♭, C♭", "B♭, E♭, A♭, D♭, G♭, C♭, F♭"];

  return (
    <div>
      {FlashCardUtils.renderStringAnswerSelectInternal(`${flashCardIndex}.0`, row0, flashCard, onAnswer, lastCorrectAnswer)}
      {FlashCardUtils.renderStringAnswerSelectInternal(`${flashCardIndex}.1`, row1, flashCard, onAnswer, lastCorrectAnswer)}
      {FlashCardUtils.renderStringAnswerSelectInternal(`${flashCardIndex}.2`, row2, flashCard, onAnswer, lastCorrectAnswer)}
    </div>
  );
}

export function createFlashCardGroup(): FlashCardGroup {
  const flashCardGroup = new FlashCardGroup("Key Accidental Notes", createFlashCards);
  flashCardGroup.renderAnswerSelect = renderAnswerSelect;
  flashCardGroup.moreInfoUri = "http://myguitarpal.com/the-order-of-sharps-and-flats/";
  flashCardGroup.containerHeight = "80px";

  return flashCardGroup;
}

export function createFlashCards(): FlashCard[] {
  return [
    FlashCard.fromRenderFns("C Major", "none"),
    FlashCard.fromRenderFns("C# Major", "F♯, C♯, G♯, D♯, A♯, E♯, B♯"),
    FlashCard.fromRenderFns("Db Major", "B♭, E♭, A♭, D♭, G♭"),
    FlashCard.fromRenderFns("D Major", "F♯, C♯"),
    FlashCard.fromRenderFns("Eb Major", "B♭, E♭, A♭"),
    FlashCard.fromRenderFns("E Major", "F♯, C♯, G♯, D♯"),
    FlashCard.fromRenderFns("F Major", "B♭"),
    FlashCard.fromRenderFns("F# Major", "F♯, C♯, G♯, D♯, A♯, E♯"),
    FlashCard.fromRenderFns("Gb Major", "B♭, E♭, A♭, D♭, G♭, C♭"),
    FlashCard.fromRenderFns("G Major", "F♯"),
    FlashCard.fromRenderFns("Ab Major", "B♭, E♭, A♭, D♭"),
    FlashCard.fromRenderFns("A Major", "F♯, C♯, G♯"),
    FlashCard.fromRenderFns("Bb Major", "B♭, E♭"),
    FlashCard.fromRenderFns("B Major", "F♯, C♯, G♯, D♯, A♯"),
    FlashCard.fromRenderFns("Cb Major", "B♭, E♭, A♭, D♭, G♭, C♭, F♭"),

    FlashCard.fromRenderFns("A Minor", "none"),
    FlashCard.fromRenderFns("A# Minor", "F♯, C♯, G♯, D♯, A♯, E♯, B♯"),
    FlashCard.fromRenderFns("Bb Minor", "B♭, E♭, A♭, D♭, G♭"),
    FlashCard.fromRenderFns("B Minor", "F♯, C♯"),
    FlashCard.fromRenderFns("C Minor", "B♭, E♭, A♭"),
    FlashCard.fromRenderFns("C# Minor", "F♯, C♯, G♯, D♯"),
    FlashCard.fromRenderFns("D Minor", "B♭"),
    FlashCard.fromRenderFns("D# Minor", "F♯, C♯, G♯, D♯, A♯, E♯"),
    FlashCard.fromRenderFns("Eb Minor", "B♭, E♭, A♭, D♭, G♭, C♭"),
    FlashCard.fromRenderFns("E Minor", "F♯"),
    FlashCard.fromRenderFns("F Minor", "B♭, E♭, A♭, D♭"),
    FlashCard.fromRenderFns("F# Minor", "F♯, C♯, G♯"),
    FlashCard.fromRenderFns("G Minor", "B♭, E♭"),
    FlashCard.fromRenderFns("G# Minor", "F♯, C♯, G♯, D♯, A♯"),
    FlashCard.fromRenderFns("Ab Minor", "B♭, E♭, A♭, D♭, G♭, C♭, F♭")
  ];
}