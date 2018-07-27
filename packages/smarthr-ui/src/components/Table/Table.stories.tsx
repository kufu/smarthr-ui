import * as React from 'react'
import { storiesOf, addDecorator } from '@storybook/react'

import { createTheme } from '../../themes/createTheme'
import { ThemeProvider } from '../../themes/ThemeProvider'
import Paper from '../Paper/'
import Table from './Table'
import TableHead from './TableHead'
import TableBody from './TableBody'
import TableRow from './TableRow'
import TableCell from './TableCell'

const theme = createTheme()
const ThemeDecorator = (storyFn: any) => <ThemeProvider theme={theme}>{storyFn()}</ThemeProvider>
addDecorator(ThemeDecorator)

storiesOf('Table', module)
  .add('default', () => (
    <Paper radius={4}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Dessert (100g serving)</TableCell>
            <TableCell>Calories</TableCell>
            <TableCell>Fat (g)</TableCell>
            <TableCell>Carbs (g)</TableCell>
            <TableCell>Protein (g)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Frozen yoghurt</TableCell>
            <TableCell>159</TableCell>
            <TableCell>6</TableCell>
            <TableCell>24</TableCell>
            <TableCell>4</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Ice cream sandwich</TableCell>
            <TableCell>159</TableCell>
            <TableCell>6</TableCell>
            <TableCell>24</TableCell>
            <TableCell>4</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Eclair</TableCell>
            <TableCell>159</TableCell>
            <TableCell>6</TableCell>
            <TableCell>24</TableCell>
            <TableCell>4</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Cupcake</TableCell>
            <TableCell>159</TableCell>
            <TableCell>6</TableCell>
            <TableCell>24</TableCell>
            <TableCell>4</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Gingerbread</TableCell>
            <TableCell>159</TableCell>
            <TableCell>6</TableCell>
            <TableCell>24</TableCell>
            <TableCell>4</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  ))
  .add('center', () => (
    <Paper radius={4}>
      <Table>
        <TableHead>
          <TableRow align="center">
            <TableCell>Dessert (100g serving)</TableCell>
            <TableCell>Calories</TableCell>
            <TableCell>Fat (g)</TableCell>
            <TableCell>Carbs (g)</TableCell>
            <TableCell>Protein (g)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow align="center">
            <TableCell>Frozen yoghurt</TableCell>
            <TableCell>159</TableCell>
            <TableCell>6</TableCell>
            <TableCell>24</TableCell>
            <TableCell>4</TableCell>
          </TableRow>
          <TableRow align="center">
            <TableCell>Ice cream sandwich</TableCell>
            <TableCell>159</TableCell>
            <TableCell>6</TableCell>
            <TableCell>24</TableCell>
            <TableCell>4</TableCell>
          </TableRow>
          <TableRow align="center">
            <TableCell>Eclair</TableCell>
            <TableCell>159</TableCell>
            <TableCell>6</TableCell>
            <TableCell>24</TableCell>
            <TableCell>4</TableCell>
          </TableRow>
          <TableRow align="center">
            <TableCell>Cupcake</TableCell>
            <TableCell>159</TableCell>
            <TableCell>6</TableCell>
            <TableCell>24</TableCell>
            <TableCell>4</TableCell>
          </TableRow>
          <TableRow align="center">
            <TableCell>Gingerbread</TableCell>
            <TableCell>159</TableCell>
            <TableCell>6</TableCell>
            <TableCell>24</TableCell>
            <TableCell>4</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  ))
  .add('custom th', () => (
    <Paper radius={4}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Dessert (100g serving)</TableCell>
            <TableCell>Calories</TableCell>
            <TableCell>Fat (g)</TableCell>
            <TableCell>Carbs (g)</TableCell>
            <TableCell>Protein (g)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell component="th">Frozen yoghurt</TableCell>
            <TableCell>159</TableCell>
            <TableCell>6</TableCell>
            <TableCell>24</TableCell>
            <TableCell>4</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th">Ice cream sandwich</TableCell>
            <TableCell>159</TableCell>
            <TableCell>6</TableCell>
            <TableCell>24</TableCell>
            <TableCell>4</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th">Eclair</TableCell>
            <TableCell>159</TableCell>
            <TableCell>6</TableCell>
            <TableCell>24</TableCell>
            <TableCell>4</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th">Cupcake</TableCell>
            <TableCell>159</TableCell>
            <TableCell>6</TableCell>
            <TableCell>24</TableCell>
            <TableCell>4</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th">Gingerbread</TableCell>
            <TableCell>159</TableCell>
            <TableCell>6</TableCell>
            <TableCell>24</TableCell>
            <TableCell>4</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  ))

storiesOf('Table/size', module)
  .add('s', () => (
    <Paper radius={4}>
      <Table size="s">
        <TableHead>
          <TableRow>
            <TableCell>Dessert (100g serving)</TableCell>
            <TableCell>Calories</TableCell>
            <TableCell>Fat (g)</TableCell>
            <TableCell>Carbs (g)</TableCell>
            <TableCell>Protein (g)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Frozen yoghurt</TableCell>
            <TableCell>159</TableCell>
            <TableCell>6</TableCell>
            <TableCell>24</TableCell>
            <TableCell>4</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Ice cream sandwich</TableCell>
            <TableCell>159</TableCell>
            <TableCell>6</TableCell>
            <TableCell>24</TableCell>
            <TableCell>4</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Eclair</TableCell>
            <TableCell>159</TableCell>
            <TableCell>6</TableCell>
            <TableCell>24</TableCell>
            <TableCell>4</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Cupcake</TableCell>
            <TableCell>159</TableCell>
            <TableCell>6</TableCell>
            <TableCell>24</TableCell>
            <TableCell>4</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Gingerbread</TableCell>
            <TableCell>159</TableCell>
            <TableCell>6</TableCell>
            <TableCell>24</TableCell>
            <TableCell>4</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  ))
  .add('m', () => (
    <Paper radius={4}>
      <Table size="m">
        <TableHead>
          <TableRow>
            <TableCell>Dessert (100g serving)</TableCell>
            <TableCell>Calories</TableCell>
            <TableCell>Fat (g)</TableCell>
            <TableCell>Carbs (g)</TableCell>
            <TableCell>Protein (g)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Frozen yoghurt</TableCell>
            <TableCell>159</TableCell>
            <TableCell>6</TableCell>
            <TableCell>24</TableCell>
            <TableCell>4</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Ice cream sandwich</TableCell>
            <TableCell>159</TableCell>
            <TableCell>6</TableCell>
            <TableCell>24</TableCell>
            <TableCell>4</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Eclair</TableCell>
            <TableCell>159</TableCell>
            <TableCell>6</TableCell>
            <TableCell>24</TableCell>
            <TableCell>4</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Cupcake</TableCell>
            <TableCell>159</TableCell>
            <TableCell>6</TableCell>
            <TableCell>24</TableCell>
            <TableCell>4</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Gingerbread</TableCell>
            <TableCell>159</TableCell>
            <TableCell>6</TableCell>
            <TableCell>24</TableCell>
            <TableCell>4</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  ))
  .add('l', () => (
    <Paper radius={4}>
      <Table size="l">
        <TableHead>
          <TableRow>
            <TableCell>Dessert (100g serving)</TableCell>
            <TableCell>Calories</TableCell>
            <TableCell>Fat (g)</TableCell>
            <TableCell>Carbs (g)</TableCell>
            <TableCell>Protein (g)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Frozen yoghurt</TableCell>
            <TableCell>159</TableCell>
            <TableCell>6</TableCell>
            <TableCell>24</TableCell>
            <TableCell>4</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Ice cream sandwich</TableCell>
            <TableCell>159</TableCell>
            <TableCell>6</TableCell>
            <TableCell>24</TableCell>
            <TableCell>4</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Eclair</TableCell>
            <TableCell>159</TableCell>
            <TableCell>6</TableCell>
            <TableCell>24</TableCell>
            <TableCell>4</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Cupcake</TableCell>
            <TableCell>159</TableCell>
            <TableCell>6</TableCell>
            <TableCell>24</TableCell>
            <TableCell>4</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Gingerbread</TableCell>
            <TableCell>159</TableCell>
            <TableCell>6</TableCell>
            <TableCell>24</TableCell>
            <TableCell>4</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  ))
