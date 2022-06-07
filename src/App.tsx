import React, { useContext, useEffect } from 'react'

import { ThemeContext } from './features/ThemeContext'
import { createTheme, ThemeProvider } from '@mui/material/styles'

import Footer from './layout/Footer'
import Header from './layout/Header'
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  CssBaseline,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material'

import { Box, Container, Typography } from '@mui/material'
import { CheckCircleOutline, HighlightOff } from '@mui/icons-material'

import bodyBackground from './assets/background.png'
import illustrationStartQuiz from './assets/undraw_quiz.svg'
import illustrationQuizQuestion from './assets/undraw_adventure.svg'
import illustrationQuizResults from './assets/undraw_winners.svg'

const light = createTheme({
  palette: {
    mode: 'light',
  },
})
const dark = createTheme({
  palette: {
    mode: 'dark',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: 'linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)),url(' + bodyBackground + ')',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          backgroundSize: 'cover',
        },
      },
    },
  },
})

const App = () => {
  const theme = useContext(ThemeContext)
  const darkMode = theme.state.darkMode

  interface QuizQuestion {
    question: string
    correctAnswer: string
    answers: string[]
    image?: string
  }

  const [countries, setCountries] = React.useState<[]>([])
  const [difficulty, setDifficulty] = React.useState<number>(0)
  const [quiz, setQuiz] = React.useState<QuizQuestion[]>([])
  const [quizIndex, setQuizIndex] = React.useState<number>(0)
  const [quizView, setQuizView] = React.useState<string>('start')
  const [selectedAnswer, setSelectedAnswer] = React.useState<String | null>(null)
  const [answerValidated, setAnswerValidated] = React.useState<Boolean>(false)

  const createQuiz = (countriesArr) => {
    const getShuffledArr = (arr) => {
      const newArr = arr.slice()
      for (let i = newArr.length - 1; i > 0; i--) {
        const rand = Math.floor(Math.random() * (i + 1))
        ;[newArr[i], newArr[rand]] = [newArr[rand], newArr[i]]
      }
      return newArr
    }

    let countriesArrCopy = []
    switch (difficulty) {
      case 0:
        countriesArrCopy = countriesArr.sort((a, b) => b.population - a.population).slice(0, 50)
        countriesArr = countriesArrCopy
        break
      case 1:
        countriesArrCopy = countriesArr.sort((a, b) => b.population - a.population).slice(0, 150)
        countriesArr = countriesArrCopy
        break
    }

    const newQuiz: QuizQuestion[] = []

    // "The capital of **country** is..." question
    countriesArr = getShuffledArr(countriesArr)
    for (let i = 0; i < 5; i++) {
      const selectedCountry = countriesArr[i]
      const incorrectAnswers = getShuffledArr(countriesArr)
        .filter((country) => country.name.common !== selectedCountry.name.common)
        .slice(0, 3)
        .map((country) => country.capital.join(', '))

      const newQuizQuestion: QuizQuestion = {
        question: 'The capital of ' + selectedCountry.name.common + ' is',
        correctAnswer: selectedCountry.capital.join(', '),
        answers: getShuffledArr([...incorrectAnswers, selectedCountry.capital.join(', ')]),
      }

      newQuiz.push(newQuizQuestion)
    }

    // "**city** is the capital of..." question
    countriesArr = getShuffledArr(countriesArr)
    for (let i = 0; i < 5; i++) {
      const selectedCountry = countriesArr[i]
      const incorrectAnswers = getShuffledArr(countriesArr)
        .filter((country) => country.capital.join(', ') !== selectedCountry.capital.join(', '))
        .slice(0, 3)
        .map((country) => country.name.common)

      const newQuizQuestion: QuizQuestion = {
        question: selectedCountry.capital.join(', ') + ' is the capital of',
        correctAnswer: selectedCountry.name.common,
        answers: getShuffledArr([...incorrectAnswers, selectedCountry.name.common]),
      }

      newQuiz.push(newQuizQuestion)
    }

    // "Which country does this flag belong to" question
    countriesArr = getShuffledArr(countriesArr)
    for (let i = 0; i < 5; i++) {
      const selectedCountry = countriesArr[i]
      const incorrectAnswers = getShuffledArr(countriesArr)
        .filter((country) => country.name.common !== selectedCountry.name.common)
        .slice(0, 3)
        .map((country) => country.name.common)

      const newQuizQuestion: QuizQuestion = {
        question: 'Which country does this flag belong to?',
        correctAnswer: selectedCountry.name.common,
        answers: getShuffledArr([...incorrectAnswers, selectedCountry.name.common]),
        image: selectedCountry.flags.png,
      }

      newQuiz.push(newQuizQuestion)
    }

    const shuffledQuiz = getShuffledArr(newQuiz)
    setQuiz(shuffledQuiz)
    setQuizIndex(0)
    setQuizView('start')
  }

  useEffect(() => {
    if (countries.length === 0)
      fetch('https://restcountries.com/v3.1/all')
        .then((res) => res.json())
        .then((json) => {
          const countriesArr = json.filter((country) => country.capital !== undefined)

          setCountries(countriesArr)
          createQuiz(countriesArr)
        })
  }, [countries])

  useEffect(() => {
    if (countries.length > 0) createQuiz(countries)
  }, [difficulty])

  const startQuizView = (
    <Card sx={{ padding: '1em', borderRadius: 5 }}>
      <CardMedia component="img" height="250" image={illustrationStartQuiz} alt="quiz" sx={{ objectFit: 'contain', padding: '2em' }} />
      <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h5" textAlign={'center'} component="div">
          How good is your knowledge of countries around the globe?
        </Typography>
        <Select value={difficulty.toString()} onChange={(event: SelectChangeEvent) => setDifficulty(parseInt(event.target.value))} displayEmpty sx={{ marginTop: 2, borderRadius: 3 }}>
          <MenuItem value={0}>Decent 🤔</MenuItem>
          <MenuItem value={1}>Pretty good 😀</MenuItem>
          <MenuItem value={2}>Phenomenal 🤩</MenuItem>
        </Select>
      </CardContent>
      <CardActions sx={{ justifyContent: 'center' }}>
        <Button
          variant={'outlined'}
          size={'large'}
          sx={{ borderRadius: 3, paddingX: 5, textTransform: 'capitalize' }}
          onClick={() => {
            setQuizView('question')
          }}
        >
          Start
        </Button>
      </CardActions>
    </Card>
  )

  const questionQuizView = quiz.length > 0 && (
    <Card sx={{ padding: 2, borderRadius: 5, position: 'relative', overflow: 'visible' }}>
      <CardMedia component="img" height="100" image={illustrationQuizQuestion} alt="quiz" sx={{ width: 'auto', objectFit: 'contain', position: 'absolute', top: '-65px', right: 0 }} />
      <CardContent>
        {quiz[quizIndex].image && (
          <img height="40" src={quiz[quizIndex].image} srcSet={quiz[quizIndex].image} loading="lazy" style={{ borderRadius: '4px', boxShadow: '0px 5px 10px 5px rgba(0,0,0,0.1)' }} />
        )}
        <Typography variant="h5" paddingTop={'15px'} component="div">
          {quiz[quizIndex].question}
        </Typography>
        <List sx={{ padding: 0 }}>
          {quiz[quizIndex].answers.map((answer, answerIndex) => {
            const isCorrectAnswer = answer === quiz[quizIndex].correctAnswer && answerValidated
            const isIncorrectAnswer = answer === selectedAnswer && answer !== quiz[quizIndex].correctAnswer && answerValidated
            const isSelectedAnswer = answer === selectedAnswer && !answerValidated

            const buttonColor = isCorrectAnswer || isIncorrectAnswer || isSelectedAnswer ? 'white' : 'primary.main'
            const buttonBackgroundColor = isCorrectAnswer ? 'success.main' : isIncorrectAnswer ? 'error.main' : isSelectedAnswer ? 'warning.main' : 'default.main'

            return (
              <ListItem
                key={answer}
                disablePadding
                sx={{ paddingY: '1em' }}
                secondaryAction={
                  isCorrectAnswer ? (
                    <IconButton
                      disableRipple
                      edge="end"
                      sx={{
                        color: buttonColor,
                      }}
                    >
                      <CheckCircleOutline />
                    </IconButton>
                  ) : selectedAnswer === answer && answerValidated ? (
                    <IconButton
                      disableRipple
                      edge="end"
                      sx={{
                        color: buttonColor,
                      }}
                    >
                      <HighlightOff />
                    </IconButton>
                  ) : undefined
                }
              >
                <ListItemButton
                  sx={{
                    color: buttonColor,
                    border: '2px solid',
                    borderRadius: 3,
                    borderColor: buttonBackgroundColor,
                    bgcolor: buttonBackgroundColor,
                    ':hover': {
                      bgcolor: buttonBackgroundColor.replace('main', 'dark'),
                    },
                  }}
                  onClick={() => (!answerValidated ? setSelectedAnswer(answer) : undefined)}
                >
                  <ListItemIcon
                    sx={{
                      color: buttonColor,
                    }}
                  >
                    {String.fromCharCode(answerIndex + 'A'.charCodeAt(0))}
                  </ListItemIcon>
                  <ListItemText color="primary" primary={answer} />
                </ListItemButton>
              </ListItem>
            )
          })}
        </List>
      </CardContent>
      <CardActions sx={{ display: selectedAnswer ? undefined : 'none', justifyContent: 'end', paddingTop: 0, paddingBottom: 2, paddingX: 2 }}>
        <Button
          variant={'contained'}
          size={'large'}
          color={'warning'}
          sx={{ borderRadius: 3, paddingX: 5, textTransform: 'capitalize' }}
          onClick={() => {
            if (!answerValidated) setAnswerValidated(true)
            else {
              setSelectedAnswer(null)
              setAnswerValidated(false)
              quiz[quizIndex].correctAnswer === selectedAnswer ? setQuizIndex(quizIndex + 1) : setQuizView('results')
            }
          }}
        >
          {!answerValidated ? 'Validate' : quiz[quizIndex].correctAnswer === selectedAnswer ? 'Next' : 'Check results'}
        </Button>
      </CardActions>
    </Card>
  )

  const resultsQuizView = (
    <Card sx={{ padding: '1em' }}>
      <CardMedia component="img" height="250" image={illustrationQuizResults} alt="quiz" sx={{ objectFit: 'contain', padding: '2em' }} />
      <CardContent>
        <Typography variant="h3" textAlign={'center'} component="h3">
          Results
        </Typography>
        <Typography variant="h5" textAlign={'center'} component="p">
          You got
          <Typography variant="h4" sx={{ color: 'success.main' }} component="span">
            {` ${quizIndex} `}
          </Typography>
          correct answers
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'center' }}>
        <Button variant={'outlined'} size={'large'} sx={{ borderRadius: 3, paddingX: 5, textTransform: 'capitalize' }} onClick={() => createQuiz(countries)}>
          Try again
        </Button>
      </CardActions>
    </Card>
  )

  const quizEl = (
    <>
      <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', flex: 1 }}>
        {quiz && (
          <Box paddingY={5} sx={{ width: '100%', typography: 'body1' }}>
            <Typography variant="h4" component={'h2'} gutterBottom sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}>
              country quiz
            </Typography>
            {quizView === 'start' && startQuizView}
            {quizView === 'question' && questionQuizView}
            {quizView === 'results' && resultsQuizView}
          </Box>
        )}
      </Container>
    </>
  )

  return (
    <ThemeProvider theme={darkMode ? dark : light}>
      <CssBaseline enableColorScheme />
      <Header />
      {quizEl}
      <Footer />
    </ThemeProvider>
  )
}

export default App
