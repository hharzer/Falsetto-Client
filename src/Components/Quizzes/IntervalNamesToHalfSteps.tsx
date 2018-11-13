import * as React from 'react';
import * as Vex from 'vexflow';

import { Quiz } from "../../Quiz";
import { Quiz as QuizComponent } from "../Quiz";

import Button from "@material-ui/core/Button";

export class IntervalNamesToHalfSteps extends React.Component<{}, {}> {
  public static createQuiz(): Quiz {
    const intervalNames = [
      "Unison",
      "m2",
      "M2",
      "m3",
      "M3",
      "P4",
      "A4/d5",
      "P5",
      "m6",
      "M6",
      "m7",
      "M7",
      "P8"
    ];
    return new Quiz(
      "Interval Names To Half Steps",
      intervalNames.map(intervalName => (() => <span style={{ fontSize: "2em" }}>{intervalName}</span>)),
      intervalNames.map((_, i) => i),
      selectAnswerIndex => {
        const intervalButtons = intervalNames.map((interval, i) => {
          const text = i;
          return <span key={i} style={{padding: "1em"}}><Button onClick={event => selectAnswerIndex(i)} variant="outlined" color="primary">{text}</Button></span>;
        }, this);
        return <div style={{lineHeight: 3}}>{intervalButtons}</div>;
      }
    );
  }

  constructor(props: {}) {
    super(props);

    this.sheetMusicRef = React.createRef();
    this.quiz = IntervalNamesToHalfSteps.createQuiz();
  }

  public componentDidMount() {
    // Create an SVG renderer and attach it to the DIV element named "boo".
    const div = (this.sheetMusicRef as any).current;
    if (!div) {
      return;
    }

    const renderer = new Vex.Flow.Renderer(div, Vex.Flow.Renderer.Backends.SVG);

    // Configure the rendering context.
    renderer.resize(500, 500);
    const context = renderer.getContext();
    context.setFont("Arial", 10).setBackgroundFillStyle("#eed");

    // Create a stave of width 400 at position 10, 40 on the canvas.
    const stave = new Vex.Flow.Stave(10, 40, 400);

    // Add a clef and time signature.
    stave.addClef("treble").addTimeSignature("4/4");

    // Connect it to the rendering context and draw!
    stave.setContext(context).draw();
  }
  public render(): JSX.Element {
    return (
      <div>
        <QuizComponent quiz={this.quiz} />
        <div ref={this.sheetMusicRef} />
      </div>
    );
  }

  private sheetMusicRef: React.Ref<HTMLDivElement>;
  private quiz: Quiz;
}