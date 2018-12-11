import * as React from 'react';
import { Paper, AppBar, Typography, Toolbar } from '@material-ui/core';
import * as Utils from "../Utils";

import "./App.css";

import { Quiz as QuizComponent } from "./Quiz";
import * as IntervalNamesToHalfSteps from './Quizzes/IntervalNamesToHalfSteps';
import * as IntervalQualitySymbolsToQualities from './Quizzes/IntervalQualitySymbolsToQualities';
import * as GenericIntervalsToIntervalQualities from "./Quizzes/GenericIntervalsToIntervalQualities";
import * as IntervalsToConsonanceDissonance from "./Quizzes/IntervalsToConsonanceDissonance";
import * as MajorScaleDegreeModes from "./Quizzes/MajorScaleDegreeModes";
import * as ChordNotes from "./Quizzes/ChordNotes";
import * as ScaleNotes from "./Quizzes/ScaleNotes";
import * as ScaleChords from "./Quizzes/ScaleChords";
import * as ScaleCharacteristics from "./Quizzes/ScaleCharacteristics";
import * as ScaleFamilies from "./Quizzes/ScaleFamilies";
import * as ScaleDegreeNames from "./Quizzes/ScaleDegreeNames";
import * as ChordFamilies from "./Quizzes/ChordFamilies";
import * as ChordFamilyDefinitions from "./Quizzes/ChordFamilyDefinitions";
import * as AvailableChordTensions from "./Quizzes/AvailableChordTensions";
import * as DiatonicTriads from "./Quizzes/DiatonicTriads";
import * as DiatonicSeventhChords from "./Quizzes/DiatonicSeventhChords";
import { RandomChordGenerator } from "./RandomChordGenerator";
import * as GuitarNotes from "./GuitarNotes";
import * as PianoNotes from "./PianoNotes";
import * as SheetMusicNotes from "./SheetMusicNotes";
import * as NoteDurations from "./Quizzes/NoteDurations";
import { FlashCard } from 'src/FlashCard';
import { FlashCardGroup } from 'src/FlashCardGroup';
import { StudyFlashCards } from './StudyFlashCards';
import * as Overview from "./Quizzes/TheJazzPianoSite/TheBasics/Overview"

export interface IAppState {
  currentFlashCardGroupIndex: number;
  currentComponentOverride: any;
}
class App extends React.Component<{}, IAppState> {
  public constructor(props: {}) {
    super(props);

    this.flashCardGroups = [
      new FlashCardGroup("Interval Names To Half Steps", IntervalNamesToHalfSteps.createFlashCards()),
      new FlashCardGroup("Interval Quality Symbols To Qualities", IntervalQualitySymbolsToQualities.createFlashCards()),
      new FlashCardGroup("Generic Intervals To Interval Qualities", GenericIntervalsToIntervalQualities.createFlashCards()),
      new FlashCardGroup("Intervals To Consonance Dissonance", IntervalsToConsonanceDissonance.createFlashCards()),
      new FlashCardGroup("Major Scale Degree Modes", MajorScaleDegreeModes.createFlashCards()),
      new FlashCardGroup("Chord Notes", ChordNotes.createFlashCards()),
      new FlashCardGroup("Scale Notes", ScaleNotes.createFlashCards()),
      new FlashCardGroup("Scale Chords", ScaleChords.createFlashCards()),
      new FlashCardGroup("Scale Characteristics", ScaleCharacteristics.createFlashCards()),
      new FlashCardGroup("Scale Families", ScaleFamilies.createFlashCards()),
      new FlashCardGroup("Scale Degree Names", ScaleDegreeNames.createFlashCards()),
      new FlashCardGroup("Chord Families", ChordFamilies.createFlashCards()),
      new FlashCardGroup("Chord Family Definitions", ChordFamilyDefinitions.createFlashCards()),
      new FlashCardGroup("Available Chord Tensions", AvailableChordTensions.createFlashCards()),
      new FlashCardGroup("Piano Notes", PianoNotes.createFlashCards()),
      new FlashCardGroup("Guitar Notes", GuitarNotes.createFlashCards()),
      new FlashCardGroup("Sheet Music Notes", SheetMusicNotes.createFlashCards()),
      new FlashCardGroup("Note Durations", NoteDurations.createFlashCards()),
      new FlashCardGroup("Overview", Overview.createFlashCards()),
      new FlashCardGroup("Diatonic Triads", DiatonicTriads.createFlashCards()),
      new FlashCardGroup("Diatonic Seventh Chords", DiatonicSeventhChords.createFlashCards())
    ];

    this.flashCards = Utils.flattenArrays<FlashCard>(this.flashCardGroups.map(g => g.flashCards));

    this.state = {
      currentFlashCardGroupIndex: 0,
      currentComponentOverride: null
    };
  }

  public render(): JSX.Element {
    const flashCardGroupLinks = this.flashCardGroups
      .map(
        (flashCardGroup, i) => {
          let className = "nav-link";
          if ((!this.state.currentComponentOverride) && (i === this.state.currentFlashCardGroupIndex)) {
            className += " active";
          }

          return <a key={i} href="" onClick={event => { event.preventDefault(); this.changeQuiz(i); }} className={className}>{flashCardGroup.name}</a>
        },
        this
      );
    const componentOverrideLinks = this.componentOverrides
      .map(
        (componentOverride, i) => {
          let className = "nav-link";
          if (this.state.currentComponentOverride === componentOverride.component) {
            className += " active";
          }

          return <a key={i} href="" onClick={event => { event.preventDefault(); this.setComponentOverride(componentOverride.component); }} className={className}>{componentOverride.name}</a>
        },
        this
      );
    const currentFlashCardGroup = this.flashCardGroups[this.state.currentFlashCardGroupIndex];

    return (
      <div className="app">
        <AppBar position="static" className="top-pane">
          <Toolbar>
            <Typography variant="h6" color="inherit">
              Header
            </Typography>
          </Toolbar>
        </AppBar>
        <div className="bottom-pane horizontal-panes">
          <Paper className="left-pane">
            <div className="left-nav">
              {flashCardGroupLinks}
              {componentOverrideLinks}
            </div>
          </Paper>
          <div className="right-pane">
            {!this.state.currentComponentOverride ? <StudyFlashCards key={this.state.currentFlashCardGroupIndex} title={currentFlashCardGroup.name} flashCards={currentFlashCardGroup.flashCards} /> : null}
            {this.state.currentComponentOverride ? React.createElement(this.state.currentComponentOverride) : null}
          </div>
        </div>
      </div>
    );
  }

  private flashCards: FlashCard[];
  private flashCardGroups: FlashCardGroup[];
  private componentOverrides = [
    {
      name: "Random Chord Generator",
      component: RandomChordGenerator
    }
  ];

  private changeQuiz(quizIndex: number) {
    this.setState({ currentFlashCardGroupIndex: quizIndex, currentComponentOverride: null });
  }
  private setComponentOverride(component: any) {
    this.setState({ currentComponentOverride: component });
  }
}

export default App;
