import { useEffect, useState } from "react";
import styled from "styled-components";
import Head from "next/head";
import Link from "next/link";
import db from "../../db.json";
import Footer from "../../src/components/Footer";
import GitHubCorner from "../../src/components/GitHubCorner";
import QuizBackground from "../../src/components/QuizBackground";
import QuizLogo from "../../src/components/QuizLogo";
import Widget from "../../src/components/Widget";
import Input from "../../src/components/Input";
import Button from "../../src/components/Button";
import QuizContainer from "../../src/components/QuizContainer";

function LoadingWidget() {
  return (
    <Widget>
      <Widget.Header>Carregando...</Widget.Header>

      <Widget.Content>Loading simulando internet ruim</Widget.Content>
    </Widget>
  );
}

function QuestionWidget({ question, totalQuestions, questionIndex, onSubmit }) {
  const [selectedAlternative, setSelectedAlternative] = useState(undefined);
  const [isQuestionSubmited, setIsQuestionSubmited] = useState(false);
  const isCorrect = selectedAlternative === question.answer;

  function handleSubmit(event) {
    event.preventDefault();
    setIsQuestionSubmited(true);
    setTimeout(() => {
      onSubmit();
      setIsQuestionSubmited(false);
      setSelectedAlternative(undefined);
    }, 2 * 1000);
  }
  return (
    <Widget>
      <Widget.Header>
        <h1>{`Pergunta ${questionIndex + 1} de ${totalQuestions}`}</h1>
      </Widget.Header>
      <img
        src={question.image}
        style={{
          width: "100%",
          height: "150px",
          objectFit: "cover",
        }}
      />
      <Widget.Content>
        <h2>{question.title}</h2>
        <p>{question.description}</p>
        <form onSubmit={handleSubmit}>
          {question.alternatives.map((alternative, alternativeIndex) => {
            const alternativeId = `alternative_${alternativeIndex}`;
            return (
              <>
                <Widget.Topic
                  as="label"
                  htmlFor={alternativeId}
                  key={alternativeId}
                >
                  {alternative}
                  <input
                    id={alternativeId}
                    type="radio"
                    name="alternatives"
                    onChange={() => setSelectedAlternative(alternativeIndex)}
                    default="false"
                  />
                </Widget.Topic>
                <br />
              </>
            );
          })}

          <Button
            type="submit"
            disabled={selectedAlternative === undefined ? "true" : false}
          >
            Confirmar
          </Button>
          <p>Você selecionou a alternativa{" " + selectedAlternative}</p>
          {isQuestionSubmited && isCorrect && <p>Você acertou!</p>}
          {isQuestionSubmited && !isCorrect && <p>Você errou!</p>}
        </form>
      </Widget.Content>
    </Widget>
  );
}

const screenStates = {
  QUIZ: "QUIZ",
  LOADING: "LOADING",
  RESULT: "RESULT",
};

export default function Quiz() {
  const [screenState, setSecreenState] = useState(screenStates.LOADING);
  const [questionIndex, setQuestionIndex] = useState(0);
  const totalQuestions = db.questions.length;

  const question = db.questions[questionIndex];

  useEffect(() => {
    setTimeout(
      () => {
        setSecreenState(screenStates.QUIZ);
      } /* 3 * 1000 */
    );
  }, []);

  function handleSubmit() {
    const nextQuestion = questionIndex + 1;
    if (nextQuestion < totalQuestions) {
      setQuestionIndex(nextQuestion);
    } else {
      setSecreenState(screenStates.RESULT);
    }
  }

  return (
    <>
      <Head>
        <title>Quiz Futebol Feminino</title>
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:creator" content="@willsantos" />
        <meta property="og:title" content="Quiz Futebol Feminino" key="title" />
        <meta property="og:description" content={db.description} key="title" />
        <meta property="og:image" content="/screenshot.png" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="800" />
        <meta property="og:image:height" content="600" />
      </Head>
      <QuizBackground backgroundImage={db.bg}>
        <QuizContainer>
          <QuizLogo />
          {screenState === screenStates.LOADING && <LoadingWidget />}
          {screenState === screenStates.QUIZ && (
            <QuestionWidget
              question={question}
              questionIndex={questionIndex}
              totalQuestions={totalQuestions}
              onSubmit={handleSubmit}
            />
          )}
          {screenState === screenStates.RESULT && (
            <div>Você acertou X questões, parabéns!</div>
          )}

          <Footer />
        </QuizContainer>
        <GitHubCorner projectUrl="https://github.com/willsantos/alura-quiz-ff" />
      </QuizBackground>
    </>
  );
}
