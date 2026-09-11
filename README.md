# Kitchen Table Mahjong

Mahjong solitaire for an iPad: the classic turtle layout, 144 tiles, tap two free tiles that match to clear them.

- Every deal is solvable (tiles are placed by playing a game in reverse).
- Undo, and Shuffle for when no moves are left.
- No hints. A blocked tile shakes when tapped.
- Saves the game in progress, so closing the app and coming back picks up where you left off.

Single static page, no build step. Add to Home Screen on iPad for a full-screen app with its own icon.

## Performance contract

Tile faces are stored in one preloaded `faces.png` sprite. Keep the playing board on that shared raster asset: duplicating inline SVG artwork across 144 tiles causes long paint and input stalls in mobile Safari. Fresh-deal motion belongs on the board as a whole, not on every tile.

Run the dependency-free contract checks with:

```sh
node tests/performance-contract.test.mjs
```
