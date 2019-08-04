import * as React from "react";
import { TableRow, TableCell, Table, TableHead, TableBody, Grid, Checkbox, Button } from "@material-ui/core";

import * as Utils from "../../../Utils";
import { Vector2D } from "../../../Vector2D";
import { Size2D } from "../../../Size2D";
import { Rect2D } from "../../../Rect2D";
import { ScaleType, Scale } from "../../../Scale";
import { PianoKeyboard } from "../../Utils/PianoKeyboard";
import { FlashCard, FlashCardSide } from "../../../FlashCard";
import { FlashCardSet, RenderAnswerSelectArgs } from "../../../FlashCardSet";
import { AnswerDifficulty } from "../../../StudyAlgorithm";
import { Pitch } from "../../../Pitch";
import { PitchLetter } from "../../../PitchLetter";
import { StringedInstrumentNote } from '../../../GuitarNote';
import { ChordType } from "../../../Chord";
import { GuitarFretboard, renderGuitarFretboardScaleExtras, getStandardGuitarTuning, renderGuitarNoteHighlightsAndLabels } from "../../Utils/GuitarFretboard";
import { ScaleAnswerSelect } from "../../Utils/ScaleAnswerSelect";
import { getPreferredGuitarScaleShape } from "../../Utils/GuitarFretboard";
import { ChordScaleFormula, ChordScaleFormulaPart } from '../../../ChordScaleFormula';

const flashCardSetId = "guitarScalesOrderedNotes";

const rootPitchStrs = ["Ab", "A", "Bb", "B/Cb", "C", "C#/Db", "D", "Eb", "E", "F", "F#/Gb", "G"];
const STRING_COUNT = 6;

interface IConfigData {
  enabledRootPitches: string[];
  enabledScaleTypes: string[];
}

export const GuitarScaleViewer: React.FunctionComponent<{
  scale: Scale,
  renderAllScaleShapes: boolean,
  size: Size2D
}> = props => {
  let rootPitch = Pitch.createFromMidiNumber(
    (new Pitch(PitchLetter.C, 0, 2)).midiNumber + props.scale.rootPitch.midiNumberNoOctave
  );

  // If the root pitch is below the range of the guitar, add an octave.
  const guitarLowestNoteMidiNumber = (new Pitch(PitchLetter.E, 0, 2)).midiNumber;
  if (rootPitch.midiNumber < guitarLowestNoteMidiNumber) {
    rootPitch.octaveNumber++;
  }

  const guitarTuning = getStandardGuitarTuning(STRING_COUNT);
  const guitarNotes = getPreferredGuitarScaleShape(props.scale, guitarTuning);
  const maxFretNumber = Utils.arrayMax(guitarNotes
    .map(gn => gn.getFretNumber(guitarTuning))
  );
  const minFretNumber = Math.max(0, maxFretNumber - 11);
  
  const fretboardStyle = { width: "100%", maxWidth: `${props.size.width}px`, height: "auto" };

  return (
    <GuitarFretboard
      width={props.size.width} height={props.size.height}
      tuning={guitarTuning}
      minFretNumber={minFretNumber}
      renderExtrasFn={metrics => renderGuitarFretboardScaleExtras(metrics, props.scale, props.renderAllScaleShapes)}
      style={fretboardStyle}
    />
  );
}
export const GuitarChordViewer: React.FunctionComponent<{
  chordType: ChordType,
  rootPitch: Pitch,
  size: Size2D
}> = props => {
  let rootPitch = Pitch.createFromMidiNumber(
    (new Pitch(PitchLetter.C, 0, 2)).midiNumber + props.rootPitch.midiNumberNoOctave
  );

  // If the root pitch is below the range of the guitar, add an octave.
  const guitarLowestNoteMidiNumber = (new Pitch(PitchLetter.E, 0, 2)).midiNumber;
  if (rootPitch.midiNumber < guitarLowestNoteMidiNumber) {
    rootPitch.octaveNumber++;
  }

  const guitarTuning = getStandardGuitarTuning(STRING_COUNT);
  const pitches = props.chordType.getPitches(rootPitch);
  const minFretNumber = 0;
  const fretCount = 11;
  const maxFretNumber = minFretNumber + fretCount;
  const guitarNotes = StringedInstrumentNote.allNotesOfPitches(
    guitarTuning, pitches, minFretNumber, maxFretNumber
  );

  return (
    <GuitarFretboard
      width={props.size.width} height={props.size.height}
      tuning={guitarTuning}
      minFretNumber={minFretNumber} fretCount={fretCount}
      renderExtrasFn={metrics => renderGuitarNoteHighlightsAndLabels(
        metrics, guitarNotes, "lightblue",
        (n, i) => (1 + pitches.findIndex(p => p.midiNumberNoOctave == n.pitch.midiNumberNoOctave)).toString()
      )}
    />
  );
}

export function forEachScale(callbackFn: (scale: Scale, rootPitchStr: string, i: number) => void) {
  let i = 0;
  const guitarLowestNoteMidiNumber = (new Pitch(PitchLetter.E, 0, 2)).midiNumber;

  for (let rootPitchStrIndex = 0; rootPitchStrIndex < rootPitchStrs.length; rootPitchStrIndex++) {
    // Compute the root pitch.
    const halfStepsFromC = Utils.mod(rootPitchStrIndex - 4, 12);
    const rootPitch = Pitch.createFromMidiNumber((new Pitch(PitchLetter.C, 0, 2)).midiNumber + halfStepsFromC);

    // If the root pitch is below the range of the guitar, add an octave.
    if (rootPitch.midiNumber < guitarLowestNoteMidiNumber) {
      rootPitch.octaveNumber++;
    }

    // Iterate through each scale type for the root pitch.
    for (const scaleType of ScaleType.All) {
      callbackFn(new Scale(scaleType, rootPitch), rootPitchStrs[rootPitchStrIndex], i);
      i++;
    }
  }
}
export function configDataToEnabledQuestionIds(configData: IConfigData): Array<number> {
  const newEnabledFlashCardIndices = new Array<number>();

  forEachScale((scale, rootPitchStr, i) => {
    if (
      Utils.arrayContains(configData.enabledRootPitches, rootPitchStr) &&
      Utils.arrayContains(configData.enabledScaleTypes, scale.type.name)
    ) {
      newEnabledFlashCardIndices.push(i);
    }
  });

  return newEnabledFlashCardIndices;
}
export interface IGuitarScalesFlashCardMultiSelectProps {
  flashCards: FlashCard[];
  configData: IConfigData;
  selectedFlashCardIndices: number[];
  onChange?: (newValue: number[], newConfigData: any) => void;
}

export interface IGuitarScalesFlashCardMultiSelectState {}
export class GuitarScalesFlashCardMultiSelect extends React.Component<IGuitarScalesFlashCardMultiSelectProps, IGuitarScalesFlashCardMultiSelectState> {
  public render(): JSX.Element {
    const rootPitchCheckboxTableRows = rootPitchStrs
      .map((rootPitch, i) => {
        const isChecked = this.props.configData.enabledRootPitches.indexOf(rootPitch) >= 0;
        const isEnabled = !isChecked || (this.props.configData.enabledRootPitches.length > 1);

        return (
          <TableRow key={i}>
            <TableCell><Checkbox checked={isChecked} onChange={event => this.toggleRootPitchEnabled(rootPitch)} disabled={!isEnabled} /></TableCell>
            <TableCell>{rootPitch}</TableCell>
          </TableRow>
        );
      }, this);
    const rootPitchCheckboxes = (
      <Table className="table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Root Pitch</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rootPitchCheckboxTableRows}
        </TableBody>
      </Table>
    );

    const scaleTypeCheckboxTableRows = ScaleType.All
      .map((scale, i) => {
        const isChecked = this.props.configData.enabledScaleTypes.indexOf(scale.name) >= 0;
        const isEnabled = !isChecked || (this.props.configData.enabledScaleTypes.length > 1);

        return (
          <TableRow key={i}>
            <TableCell><Checkbox checked={isChecked} onChange={event => this.toggleScaleEnabled(scale.name)} disabled={!isEnabled} /></TableCell>
            <TableCell>{scale.name}</TableCell>
          </TableRow>
        );
      }, this);
    const scaleTypeCheckboxes = (
      <Table className="table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Scale</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {scaleTypeCheckboxTableRows}
        </TableBody>
      </Table>
    );

    return (
      <Grid container spacing={32}>
        <Grid item xs={6}>{rootPitchCheckboxes}</Grid>
        <Grid item xs={6}>{scaleTypeCheckboxes}</Grid>
      </Grid>
    );
  }
  
  private toggleRootPitchEnabled(rootPitch: string) {
    const newEnabledRootPitches = Utils.toggleArrayElement(
      this.props.configData.enabledRootPitches,
      rootPitch
    );
    
    if (newEnabledRootPitches.length > 0) {
      const newConfigData: IConfigData = {
        enabledRootPitches: newEnabledRootPitches,
        enabledScaleTypes: this.props.configData.enabledScaleTypes
      };
      this.onChange(newConfigData);
    }
  }
  private toggleScaleEnabled(scale: string) {
    const newEnabledScaleTypes = Utils.toggleArrayElement(
      this.props.configData.enabledScaleTypes,
      scale
    );
    
    if (newEnabledScaleTypes.length > 0) {
      const newConfigData: IConfigData = {
        enabledRootPitches: this.props.configData.enabledRootPitches,
        enabledScaleTypes: newEnabledScaleTypes
      };
      this.onChange(newConfigData);
    }
  }
  private onChange(newConfigData: IConfigData) {
    if (!this.props.onChange) { return; }

    const newEnabledFlashCardIndices = configDataToEnabledQuestionIds(newConfigData);
    this.props.onChange(newEnabledFlashCardIndices, newConfigData);
  }
}

export interface IGuitarNotesAnswerSelectProps {
  correctAnswer: Array<Pitch>;
  onAnswer: (answerDifficulty: AnswerDifficulty, answer: any) => void;
  lastCorrectAnswer: any;
  incorrectAnswers: Array<any>;
}
export interface IGuitarNotesAnswerSelectState {
  selectedPitches: Array<Pitch>;
}
export class GuitarNotesAnswerSelect extends React.Component<IGuitarNotesAnswerSelectProps, IGuitarNotesAnswerSelectState> {
  public constructor(props: IGuitarNotesAnswerSelectProps) {
    super(props);
    
    this.state = {
      selectedPitches: []
    };
  }
  public render(): JSX.Element {
    // TODO: use lastCorrectAnswer
    return (
      <div>
        <PianoKeyboard
          rect={new Rect2D(new Size2D(300, 100), new Vector2D(0, 0))}
          lowestPitch={new Pitch(PitchLetter.C, 0, 4)}
          highestPitch={new Pitch(PitchLetter.B, 0, 5)}
          pressedPitches={this.state.selectedPitches}
          onKeyPress={pitch => this.onPitchClick(pitch)}
        />
        
        <div style={{padding: "1em 0"}}>
          <Button
            onClick={event => this.confirmAnswer()}
            disabled={this.state.selectedPitches.length === 0}
            variant="contained"
          >
            Confirm Answer
          </Button>
        </div>
      </div>
    );
  }

  private onPitchClick(pitch: Pitch) {
    const newSelectedPitches = Utils.toggleArrayElementCustomEquals(
      this.state.selectedPitches,
      pitch,
      (p1, p2) => p1.equals(p2)
    );
    this.setState({ selectedPitches: newSelectedPitches });
  }
  private confirmAnswer() {
    const selectedPitchMidiNumbersNoOctave = Utils.uniq(
      this.state.selectedPitches
        .map(pitch => pitch.midiNumberNoOctave)
    );
    const correctAnswerMidiNumbersNoOctave = Utils.uniq(
      this.props.correctAnswer
        .map(pitch => pitch.midiNumberNoOctave)
    );

    const isCorrect = (selectedPitchMidiNumbersNoOctave.length === correctAnswerMidiNumbersNoOctave.length) &&
      (selectedPitchMidiNumbersNoOctave.every(guess =>
        correctAnswerMidiNumbersNoOctave.some(answer =>
          guess === answer
        )
      ));
    this.props.onAnswer(isCorrect ? AnswerDifficulty.Easy : AnswerDifficulty.Incorrect, selectedPitchMidiNumbersNoOctave);
  }
}

export function createFlashCardSet(title?: string, initialScaleTypes?: Array<ScaleType>): FlashCardSet {
  title = (title !== undefined) ? title : "Guitar Scales";

  const renderFlashCardMultiSelect = (
    flashCards: Array<FlashCard>,
    selectedFlashCardIndices: number[],
    configData: any,
    onChange: (newValue: number[], newConfigData: any) => void
  ): JSX.Element => {
    return (
    <GuitarScalesFlashCardMultiSelect
      flashCards={flashCards}
      configData={configData}
      selectedFlashCardIndices={selectedFlashCardIndices}
      onChange={onChange}
    />
    );
  };

  const initialConfigData: IConfigData = {
    enabledRootPitches: rootPitchStrs.slice(),
    enabledScaleTypes: !initialScaleTypes
      ? ScaleType.All
        .filter((_, scaleIndex) => scaleIndex <= 8)
        .map(scale => scale.name)
      : initialScaleTypes
        .map(scaleType => Utils.unwrapValueOrUndefined(ScaleType.All.find(st => st.equals(scaleType))).name)
  };

  const flashCardSet = new FlashCardSet(flashCardSetId, title, createFlashCards);
  flashCardSet.enableInvertFlashCards = false;
  flashCardSet.initialSelectedFlashCardIndices = configDataToEnabledQuestionIds(initialConfigData);
  flashCardSet.initialConfigData = initialConfigData;
  flashCardSet.renderFlashCardMultiSelect = renderFlashCardMultiSelect;
  flashCardSet.renderAnswerSelect = renderAnswerSelect;
  flashCardSet.containerHeight = "110px";

  return flashCardSet;
}
export function createFlashCards(): Array<FlashCard> {
  const flashCards = new Array<FlashCard>();

  forEachScale((scale, rootPitchStr, i) => {
    const pitches = new ChordScaleFormula(scale.type.formula.parts.concat(new ChordScaleFormulaPart(8, 0, false))).getPitches(scale.rootPitch);
    const deserializedId = {
      set: flashCardSetId,
      midiNumberNoOctaves: pitches.map(p => p.midiNumberNoOctave)
    };
    const id = JSON.stringify(deserializedId);

    flashCards.push(new FlashCard(
      id,
      new FlashCardSide(
        (width, height) => {
          return (
            <div>
              <GuitarScaleViewer scale={scale} renderAllScaleShapes={false} size={new Size2D(400, 140)} />
            </div>
          );
        },
        pitches
      ),
      new FlashCardSide(rootPitchStr + " " + scale.type.name)
    ));
  });

  return flashCards;
}
export function renderAnswerSelect(
  state: RenderAnswerSelectArgs
) {
  if (!state.areFlashCardsInverted) {
    const correctAnswer = state.currentFlashCard.backSide.renderFn as string;
    const activeScales = ScaleType.All
      .filter((_, i) => Utils.arrayContains(state.enabledFlashCardIds, i));
    return <ScaleAnswerSelect
      key={correctAnswer} scales={activeScales} correctAnswer={correctAnswer}
      onAnswer={state.onAnswer} lastCorrectAnswer={state.lastCorrectAnswer} incorrectAnswers={state.incorrectAnswers} />;
  } else {
    const key = state.currentFlashCard.frontSide.renderFn as string;
    const correctAnswer = state.currentFlashCard.backSide.data[0] as Array<Pitch>;
    return <GuitarNotesAnswerSelect
      key={key} correctAnswer={correctAnswer} onAnswer={state.onAnswer}
      lastCorrectAnswer={state.lastCorrectAnswer} incorrectAnswers={state.incorrectAnswers} />;
  }
}