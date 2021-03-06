import * as React from "react";

import { Vector2D } from '../../../lib/Core/Vector2D';
import { Size2D } from "../../../lib/Core/Size2D";
import { Rect2D } from '../../../lib/Core/Rect2D';
import * as FlashCardUtils from "../Utils";
import { PianoKeyboard } from "../../Utils/PianoKeyboard";
import { FlashCard, FlashCardSide } from "../../../FlashCard";
import { FlashCardSet, FlashCardLevel } from "../../../FlashCardSet";
import { Pitch, ambiguousPitchStringsSymbols } from "../../../lib/TheoryLib/Pitch";
import { PitchLetter } from "../../../lib/TheoryLib/PitchLetter";

const flashCardSetId = "pianoNotes1Octave";

export function isNoteStringNatural(noteString: string): boolean {
  return noteString.length === 1;
}

function createFlashCardSet(): FlashCardSet {
  const flashCardSet = new FlashCardSet(flashCardSetId, "Piano Notes", createFlashCards);
  flashCardSet.containerHeight = "120px";
  flashCardSet.moreInfoUri = "/essential-music-theory/notes";
  flashCardSet.renderAnswerSelect = FlashCardUtils.renderNoteAnswerSelect;
  flashCardSet.createFlashCardLevels = (flashCardSet: FlashCardSet, flashCards: Array<FlashCard>) => (
    [
      new FlashCardLevel(
        "Natural Notes",
        flashCards
          .filter(fc => isNoteStringNatural(fc.backSide.data as string))
          .map(fc => fc.id),
        (curConfigData: any) => null
      ),
      new FlashCardLevel(
        "All Notes",
        flashCards.map(fc => fc.id),
        (curConfigData: any) => null
      )
    ]
  );

  return flashCardSet;
}
export function createFlashCards(): FlashCard[] {
  const pianoKeyboardRect = new Rect2D(new Size2D(200, 100), new Vector2D(0, 0));
  const lowestPitch = new Pitch(PitchLetter.C, 0, 4);
  const highestPitch = new Pitch(PitchLetter.B, 0, 4);
  const pianoStyle = { width: "100%", maxWidth: "200px" };

  return ambiguousPitchStringsSymbols
    .map((noteString, i) => {
      const pitch = Pitch.createFromMidiNumber((new Pitch(PitchLetter.C, 0, 4)).midiNumber + i);
      const deserializedId = {
        set: flashCardSetId,
        note: pitch.toOneAccidentalAmbiguousString(false, false)
      };
      const id = JSON.stringify(deserializedId);

      return new FlashCard(
        id,
        new FlashCardSide(
          () => (
            <PianoKeyboard
              rect={pianoKeyboardRect}
              lowestPitch={lowestPitch}
              highestPitch={highestPitch}
              pressedPitches={[pitch]}
              style={pianoStyle}
            />
          )
        ),
        new FlashCardSide(
          noteString,
          noteString
        )
      );
    }
  );
}

export const flashCardSet = createFlashCardSet();