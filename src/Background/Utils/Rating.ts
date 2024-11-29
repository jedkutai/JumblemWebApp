export class Rating {
    static readonly bonusConstant: number = 40;
  
    /**
     * Calculate the bonus based on opponent's and your ratings.
     * @param opponentRating The opponent's rating.
     * @param yourRating Your rating.
     * @returns The calculated bonus as an integer.
     */
    static bonus(opponentRating: number, yourRating: number): number {
      const percentage = (opponentRating - yourRating) / yourRating;
      const yourBonus = percentage * Rating.bonusConstant;
      return Math.round(yourBonus); // Convert to integer
    }
  
    /**
     * Calculate the rating change for a win.
     * @param opponentRating The opponent's rating.
     * @param yourRating Your rating.
     * @returns The rating change for a win.
     */
    static win(opponentRating: number, yourRating: number): number {
      const result = 20 + Rating.bonus(opponentRating, yourRating);
      return Math.max(result, 5); // Ensure at least 5 points
    }
  
    /**
     * Calculate the rating change for a loss.
     * @param opponentRating The opponent's rating.
     * @param yourRating Your rating.
     * @returns The rating change for a loss.
     */
    static lose(opponentRating: number, yourRating: number): number {
      const result = Rating.bonus(opponentRating, yourRating) - 20;
      return Math.min(result, 5); // Ensure at most 5 points
    }
  
    /**
     * Calculate the rating change for a draw.
     * @param opponentRating The opponent's rating.
     * @param yourRating Your rating.
     * @returns The rating change for a draw.
     */
    static draw(opponentRating: number, yourRating: number): number {
      return Rating.bonus(opponentRating, yourRating);
    }
  }
  