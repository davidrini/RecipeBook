import React from 'react';

export default class RecipePicker extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            recipeFilters: [],
            usableRecipes: props.recipes
        }

        this.handleClickRecipe = this.handleClickRecipe.bind(this);
        this.handleAddRecipeFilter = this.handleAddRecipeFilter.bind(this);
        this.handleClearRecipeFilter = this.handleClearRecipeFilter.bind(this);
        this.handleClearAllRecipeFilters = this.handleClearAllRecipeFilters.bind(this);
        this.getUsableRecipes = this.getUsableRecipes.bind(this);
    }

    handleClickRecipe(id) {
        this.props.onClickRecipe(id);
    }

    handleAddRecipeFilter() {
        let input = document.getElementById("recipeFilterInput")
        if (input.value && input.value.length > 1) {
            let filter = input.value;
            let filters = this.state.recipeFilters;
            if (!filters.includes(filter.toLowerCase())) {
                filters.push(filter.toLowerCase());
                this.setState({
                    recipeFilters: filters
                });
            }
        }

        input.value = '';
        this.getUsableRecipes();
    }

    getUsableRecipes() {
        var recipes = this.props.recipes;
        let recipeFilters = this.state.recipeFilters;

        // var ingredientRegex = '/(a-zA-Z)/'
        
        if (recipeFilters.length > 0) {
            recipes = recipes.filter((value) => {
                let ingredients = value.ingredients.map(x => x.toLowerCase()).join();
                
                // let ents = ingredientRegex.match(ingredients);
                let keep = true;
                recipeFilters.forEach(element => {
                    if (!ingredients.includes(element)) {
                        keep =  false;
                    }
                });

                return keep;
            });
        }

        this.setState({
            usableRecipes: recipes
        });
    }

    handleClearRecipeFilter(filter) {
        let filters = this.state.recipeFilters;
        for (let i = 0; i < filters.length; i++)
            if (filters[i] == filter)
                filters.splice(i, 1);
        this.setState({ recipeFilters: filters });
        this.getUsableRecipes();
    }

    handleClearAllRecipeFilters() {
        this.state.recipeFilters = [];
        this.getUsableRecipes();
    }

    componentDidUpdate() {
        let usableRecipes = this.state.usableRecipes;
        if (!usableRecipes.map(it => it.id).includes(this.props.currentlySelected))
            if (usableRecipes.length > 0)
                this.handleClickRecipe(usableRecipes[0].id);
    }

    render() {
        var recipes = this.state.usableRecipes;
        let recipeFilters = this.state.recipeFilters;

        const recipeList = recipes.map(recipe => {
            const isSelected = recipe.id === this.props.currentlySelected;
            const activeClass = isSelected ? 'is-active' : null;
            return (
                <a className={"panel-block " + activeClass} key={recipe.id} onClick={isSelected ? null : () => this.handleClickRecipe(recipe.id)}>
                    <span className="panel-icon">
                        <span className="" aria-hidden="true">{recipe.emoji}</span>
                    </span>
                    {recipe.name}
                </a>
            );
        });

        let clearFiltersButton = recipeFilters.length > 0
            ? <button onClick={() => this.handleClearAllRecipeFilters()}>Clear</button>
            : '';

        let filterList = recipeFilters.length > 0
            ? recipeFilters.map(f =>
                <span key={f} className={"tag is-link"}>
                    {f}
                    <button className={"delete"} onClick={() => this.handleClearRecipeFilter(f)}></button>
                </span>
            )
            : '';

        return (
            <nav className="panel">
                <p className="panel-heading">
                    Recipes
                </p>
                <div className="panel-block">
                    <p className="control has-icons-left">
                        <input id="recipeFilterInput" className="input is-small" type="text" placeholder="search" />
                        {filterList}
                        <br />
                        <button onClick={() => this.handleAddRecipeFilter()}>Add</button>
                        {clearFiltersButton}
                        <span onClick={() => this.removeFilter(f)} className="icon is-small is-left">
                            <i className="fas fa-search" aria-hidden="true"> </i>
                        </span>
                    </p>
                </div>

                {recipeList}
            </nav>
        )
    }
}