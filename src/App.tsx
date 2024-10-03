import { useState, useEffect } from "react";
import useLocalStorageState from "use-local-storage-state";
import styled from "styled-components";
import {
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import RestaurantIcon from "@mui/icons-material/Restaurant";

interface Ingredient {
  name: string;
  amount: number;
  unit: string;
}

interface Recipe {
  id: number;
  name: string;
  ingredients: Ingredient[];
  instructions: string;
  servings: number;
}

const AppContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
  background: linear-gradient(45deg, #ff9a9e, #fad0c4, #ffecd2);
  border-radius: 20px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
`;

const StyledButton = styled(Button)`
  && {
    margin-top: 1rem;
    background: linear-gradient(45deg, #ff9a9e, #fad0c4);
    color: #fff;
    font-weight: bold;
    &:hover {
      background: linear-gradient(45deg, #fad0c4, #ff9a9e);
    }
  }
`;

const StyledListItem = styled(ListItem)`
  && {
    background: rgba(255, 255, 255, 0.7);
    margin-bottom: 1rem;
    border-radius: 10px;
    transition: all 0.3s ease;
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }
  }
`;

const StyledTypography = styled(Typography)`
  && {
    font-family: 'Pacifico', cursive;
    color: #ff6b6b;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

function App() {
  const [recipes, setRecipes] = useLocalStorageState<Recipe[]>("recipes", {
    defaultValue: [],
  });
  const [newRecipe, setNewRecipe] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editRecipe, setEditRecipe] = useState<Recipe | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [servingsMultiplier, setServingsMultiplier] = useState(1);

  useEffect(() => {
    if (recipes.length === 0) {
      const boilerplateRecipes: Recipe[] = [
        {
          id: 1,
          name: "Spaghetti Carbonara",
          ingredients: [
            { name: "Spaghetti", amount: 400, unit: "g" },
            { name: "Eggs", amount: 4, unit: "" },
            { name: "Pancetta", amount: 200, unit: "g" },
            { name: "Parmesan cheese", amount: 100, unit: "g" },
          ],
          instructions: "Cook pasta. Mix eggs, cheese, and pancetta. Combine and serve.",
          servings: 4,
        },
        {
          id: 2,
          name: "Chicken Stir Fry",
          ingredients: [
            { name: "Chicken breast", amount: 500, unit: "g" },
            { name: "Mixed vegetables", amount: 400, unit: "g" },
            { name: "Soy sauce", amount: 3, unit: "tbsp" },
          ],
          instructions: "Cook chicken. Add vegetables. Stir fry with soy sauce.",
          servings: 3,
        },
        {
          id: 3,
          name: "Greek Salad",
          ingredients: [
            { name: "Cucumber", amount: 1, unit: "" },
            { name: "Tomatoes", amount: 3, unit: "" },
            { name: "Feta cheese", amount: 150, unit: "g" },
            { name: "Olives", amount: 50, unit: "g" },
          ],
          instructions: "Chop vegetables. Mix with cheese and olives. Add dressing.",
          servings: 2,
        },
        {
          id: 4,
          name: "Banana Smoothie",
          ingredients: [
            { name: "Bananas", amount: 2, unit: "" },
            { name: "Milk", amount: 250, unit: "ml" },
            { name: "Honey", amount: 1, unit: "tbsp" },
          ],
          instructions: "Blend all ingredients until smooth.",
          servings: 1,
        },
        {
          id: 5,
          name: "Vegetable Soup",
          ingredients: [
            { name: "Mixed vegetables", amount: 500, unit: "g" },
            { name: "Vegetable stock", amount: 1, unit: "L" },
            { name: "Onion", amount: 1, unit: "" },
          ],
          instructions: "Sauté onion. Add vegetables and stock. Simmer until cooked.",
          servings: 4,
        },
      ];
      setRecipes(boilerplateRecipes);
    }
  }, [recipes, setRecipes]);

  const handleAddRecipe = () => {
    if (newRecipe.trim() !== "") {
      setRecipes([
        ...recipes,
        {
          id: Date.now(),
          name: newRecipe.trim(),
          ingredients: [],
          instructions: "",
          servings: 1,
        },
      ]);
      setNewRecipe("");
    }
  };

  const handleDeleteRecipe = (id: number) => {
    setRecipes(recipes.filter((recipe) => recipe.id !== id));
  };

  const handleEditRecipe = (id: number) => {
    const recipeToEdit = recipes.find((recipe) => recipe.id === id);
    if (recipeToEdit) {
      setEditingId(id);
      setEditRecipe(recipeToEdit);
      setOpenDialog(true);
      setServingsMultiplier(1);
    }
  };

  const handleUpdateRecipe = () => {
    if (editRecipe) {
      setRecipes(
        recipes.map((recipe) =>
          recipe.id === editingId ? editRecipe : recipe
        )
      );
    }
    setOpenDialog(false);
    setEditingId(null);
    setEditRecipe(null);
  };

  const handleServingsChange = (event: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      setServingsMultiplier(newValue);
      if (editRecipe) {
        const updatedIngredients = editRecipe.ingredients.map(ingredient => ({
          ...ingredient,
          amount: (ingredient.amount / editRecipe.servings) * newValue
        }));
        setEditRecipe({
          ...editRecipe,
          ingredients: updatedIngredients,
          servings: newValue
        });
      }
    }
  };

  return (
    <AppContainer>
      <StyledTypography variant="h3" component="h1" gutterBottom>
        Funky Recipe Book
      </StyledTypography>
      <TextField
        fullWidth
        variant="outlined"
        label="New Recipe"
        value={newRecipe}
        onChange={(e) => setNewRecipe(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && handleAddRecipe()}
        autoFocus
      />
      <StyledButton
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleAddRecipe}
        startIcon={<RestaurantIcon />}
      >
        Add Recipe
      </StyledButton>
      <List>
        {recipes.map((recipe) => (
          <StyledListItem key={recipe.id}>
            <ListItemText
              primary={recipe.name}
              secondary={`Servings: ${recipe.servings}`}
            />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="edit"
                onClick={() => handleEditRecipe(recipe.id)}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => handleDeleteRecipe(recipe.id)}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </StyledListItem>
        ))}
      </List>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Recipe</DialogTitle>
        <DialogContent>
          {editRecipe && (
            <>
              <TextField
                fullWidth
                label="Recipe Name"
                value={editRecipe.name}
                onChange={(e) => setEditRecipe({ ...editRecipe, name: e.target.value })}
                margin="normal"
              />
              <Typography gutterBottom>Ingredients:</Typography>
              {editRecipe.ingredients.map((ingredient, index) => (
                <TextField
                  key={index}
                  fullWidth
                  label={`Ingredient ${index + 1}`}
                  value={`${ingredient.amount.toFixed(2)} ${ingredient.unit} ${ingredient.name}`}
                  margin="dense"
                  InputProps={{ readOnly: true }}
                />
              ))}
              <TextField
                fullWidth
                label="Instructions"
                value={editRecipe.instructions}
                onChange={(e) => setEditRecipe({ ...editRecipe, instructions: e.target.value })}
                margin="normal"
                multiline
                rows={4}
              />
              <Typography gutterBottom>Adjust Servings:</Typography>
              <Slider
                value={servingsMultiplier}
                onChange={handleServingsChange}
                aria-labelledby="servings-slider"
                step={1}
                marks
                min={1}
                max={10}
                valueLabelDisplay="auto"
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdateRecipe} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </AppContainer>
  );
}

export default App;