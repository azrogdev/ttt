# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
## [1.1.1] - 2024-03-07

### Fixed
- Improved the validations of the different parameters when they were provided.

### Added
- **Data Functions**: Introduced `Save` and `Restore` functions to save and restore the state of a game. These functions automatically handle JSON format, providing a robust mechanism for managing game state across sessions.
- **Validation Mechanism**: Implemented a comprehensive validation mechanism using `validateProperty` function. This ensures that all inputs and states are verified against expected types and values, significantly reducing the likelihood of errors due to invalid data.
- **New Format**: Now you can easily manipulate the grid with the property `flatGrid` who return a `1d` grid.

### Changed
- **Game Logic Optimization**: Refined several aspects of the game logic to enhance performance and user experience. This includes optimizing the grid handling and the win condition checks to be more efficient.

### Security
- Enhanced security measures to protect against potential data manipulation. All game state data is now thoroughly validated both when saving and restoring, ensuring that only valid states are processed.

## [1.1.0] - 2024-03-06

### Fixed
- Improved the turn-based system by addressing an issue where players could take consecutive turns under certain conditions. This enhancement ensures that turns are correctly alternated between players, maintaining the fairness and integrity of the gameplay.

## [1.0.0] - 2024-03-05

### Added
- **Versatile Gameplay**: Introduced the ability to play against an AI bot, engage in player vs. player battles, or enter training mode to refine strategic skills.
- **Customizable Difficulty**: Added functionality to tailor the bot's difficulty to match your skill level, making the game as challenging or as accessible as desired.
- **Training Mode**: Implemented a training mode that offers guidance on the best moves to make, improving your gameplay strategy as you play.
- **Turn-based System**: Integrated a turn-based system that automatically activates after calling `game.start()`, preventing players from taking consecutive turns.
- **List of Available Events**: Added events `GameStarted`, `GameEnded`, `UpdateGrid`, `Move`, and `TrainingMove`, enhancing interaction with the game module.
