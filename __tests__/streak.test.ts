import {
  calculateLongestStreak,
  calculateStreakSuccessPercentage,
} from "../src/server/core/streak_logic";

describe("streak calculations", () => {
  [
    { start: new Date("2023-01-05"), end: new Date("2023-01-15"), defeats: 0, percentage: 100.0 },
    { start: new Date("2023-01-05"), end: new Date("2023-01-15"), defeats: 1, percentage: 90.0 },
    { start: new Date("2023-01-05"), end: new Date("2023-01-06"), defeats: 1, percentage: 0.0 },
    { start: new Date("2023-01-05"), end: new Date("2023-01-05"), defeats: 0, percentage: 100.0 },
    { start: new Date("2023-01-05"), end: new Date("2023-01-20"), defeats: 3, percentage: 80.0 },
  ].forEach(({ start, end, defeats, percentage }) => {
    it(`should calculate streak success percentage ${[percentage]}`, () => {
      const result = calculateStreakSuccessPercentage(start, end, defeats);
      expect(result).toBeCloseTo(percentage, 2);
    });
  });

  [
    { start: new Date("2023-05-02"), end: new Date("2023-05-02"), defeats: [], streak: 0 },
    { start: new Date("2023-05-02"), end: new Date("2023-05-12"), defeats: [], streak: 10 },
    {
      start: new Date("2023-05-02"),
      end: new Date("2023-05-12"),
      defeats: [new Date("2023-05-03")],
      streak: 9,
    },
    {
      start: new Date("2023-05-02"),
      end: new Date("2023-05-12"),
      defeats: [new Date("2023-05-10")],
      streak: 8,
    },
    {
      start: new Date("2023-05-02"),
      end: new Date("2023-05-12"),
      defeats: [new Date("2023-05-07")],
      streak: 5,
    },
    {
      start: new Date("2023-05-02"),
      end: new Date("2023-05-03"),
      defeats: [],
      streak: 1,
    },
    {
      start: new Date("2023-05-02"),
      end: new Date("2023-05-22"),
      defeats: [new Date("2023-05-05"), new Date("2023-05-20")],
      streak: 15,
    },
  ].forEach(({ start, end, defeats, streak }) => {
    it(`should calculate the longest streak ${streak}`, () => {
      const result = calculateLongestStreak(start, end, defeats);
      expect(result.streak).toBe(streak);
    });
  });
});
