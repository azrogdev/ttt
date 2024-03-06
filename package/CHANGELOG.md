# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
