import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  Progress,
  Input,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import styled from "styled-components";
import words from "./assets/words1.json";

words.sort(function (a, b) {
  var nameA = a.english_word.toUpperCase(); // ignore upper and lowercase
  var nameB = b.english_word.toUpperCase(); // ignore upper and lowercase
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }

  return 0;
});

function shuffle(array) {
  let temp = array.slice();
  temp.sort(() => Math.random() - 0.5);
  return temp;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
}

function App() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [wordOrder, setWordOrder] = useState(shuffle(words));
  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(
    currentWordIdx === wordOrder.length
      ? []
      : wordOrder[currentWordIdx].korean_definition
  );
  const [idk, setIdk] = useState(false);

  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    if (currentWordIdx === wordOrder.length) return;
    setCorrectAnswers(wordOrder[currentWordIdx].korean_definition);
    setAnswers([]);
  }, [currentWordIdx]);

  const showErrorToast = (message) => {
    toast.error(message, { duration: 1500 });
  };

  const correct = () => {
    setCurrentWordIdx(currentWordIdx + 1);
    setIdk(false);
    toast.success("Correct!");
  };

  const appendAnswer = (answer, index) => {
    let temp = answers.slice();
    temp[index] = answer;
    setAnswers(temp);
  };

  const checkAnswer = () => {
    let correctAnswersTemp = correctAnswers.slice();
    let answersTemp = answers.slice();
    correctAnswersTemp = correctAnswersTemp.map((e) =>
      e.trim().split(" ").join("")
    );
    answersTemp = answersTemp.map((e) => e.trim().split(" ").join(""));
    correctAnswersTemp.sort();
    answersTemp.sort();

    if (correctAnswersTemp.join(" ") === answersTemp.join(" ")) {
      correct();
    } else {
      const random = getRandomInt(0, 5);
      switch (random) {
        case 0:
          showErrorToast("Wrong, you stupid!");
          break;
        case 1:
          showErrorToast("Wrong, you idiot!");
          break;
        case 2:
          showErrorToast("Wrong. You're so dumb.");
          break;
        case 3:
          showErrorToast("Wrong, you fool!");
          break;
        case 4:
          showErrorToast("Wrong. What a noob.");
          break;
      }
    }
  };

  const restart = () => {
    setCurrentWordIdx(0);
    setWordOrder(shuffle(words));
  };

  return (
    <Container>
      <Modal
        scrollBehavior="inside"
        size="md"
        isOpen={isOpen}
        onClose={onClose}
        className="dark"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Word List
              </ModalHeader>
              <ModalBody>
                {words.map((word) => (
                  <p key={word.english_word}>
                    {word.english_word}: {word.korean_definition.join(", ")}
                  </p>
                ))}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Toaster />
      <Header>
        <Title>{idk ? "Stupid" : "3모 단어 암기 대작전"}</Title>
        <ProgressBar>
          <Progress
            size="sm"
            aria-label="Loading..."
            value={((currentWordIdx + 1) / wordOrder.length) * 100}
          />
          <ProgressText>
            {idk
              ? "Stupid"
              : currentWordIdx === wordOrder.length
              ? "Finished!"
              : currentWordIdx + 1 + "/" + wordOrder.length}
          </ProgressText>
        </ProgressBar>
      </Header>
      <Main>
        {currentWordIdx !== wordOrder.length ? (
          <>
            <Word>
              {wordOrder[currentWordIdx].english_word}
              {idk && ": " + correctAnswers.join(", ")}
            </Word>
            <Answer>
              {wordOrder[currentWordIdx].korean_definition.map((e, idx) => (
                <AnswerInput
                  key={idx}
                  name={idx}
                  appendAnswer={appendAnswer}
                  currentWordIdx={currentWordIdx}
                  checkAnswer={checkAnswer}
                />
              ))}
            </Answer>
            <Buttons>
              <Button
                onPress={() => {
                  setIdk(true);
                }}
              >
                {idk ? "Stupid" : "IDK"}
              </Button>
              <Button
                color="primary"
                onPress={() => {
                  checkAnswer();
                }}
              >
                {idk ? "Stupid" : "Submit"}
              </Button>
              <Button
                onPress={() => {
                  onOpen();
                }}
              >
                {idk ? "Stupid" : "Word List"}
              </Button>
            </Buttons>
          </>
        ) : (
          <>
            <Word style={{ textAlign: "center" }}>
              Congratulations! You are not an idiot anymore!😜
            </Word>
            <Buttons>
              <Button
                onPress={() => {
                  restart();
                }}
              >
                Start Over
              </Button>
            </Buttons>
          </>
        )}
      </Main>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const Title = styled.div`
  width: 100%;
  text-align: center;
  font-size: 1.6rem;
  padding: 1rem 0;
  font-weight: bold;
`;

const ProgressBar = styled.div`
  width: 70vw;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const ProgressText = styled.div`
  font-size: 1.2rem;
  margin-top: 0.5rem;
`;

const Main = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 0 2rem 4rem 2rem;
`;

const Word = styled.div`
  font-size: 1.6rem;
  font-weight: bold;
  margin-bottom: 1rem;
  text-align: center;
`;

const Answer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 2rem;
`;

const Buttons = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
`;

const AnswerInput = ({ name, appendAnswer, currentWordIdx, checkAnswer }) => {
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    setAnswer("");
    if (name === 0) {
      document.querySelector("input").focus();
    }
  }, [currentWordIdx]);

  return (
    <AnswerInputContainer>
      <Input
        autoFocus={name === 0 ? true : false}
        type="text"
        variant="faded"
        defaultValue=""
        value={answer}
        onChange={(e) => {
          appendAnswer(e.target.value, name);
          setAnswer(e.target.value);
        }}
        label={"definition " + (name + 1)}
        onSubmit={(e) => {
          e.preventDefault();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            checkAnswer();
          }
        }}
        onKeyUp={(e) => {
          e.preventDefault();
        }}
      />
    </AnswerInputContainer>
  );
};

const AnswerInputContainer = styled.div`
  width: 15rem;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  padding: 0.5rem;
`;

export default App;
