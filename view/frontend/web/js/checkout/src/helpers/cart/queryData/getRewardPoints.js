import functionExtension from '@/extensions/functionExtension';

export default async () => {
  const rewardPoints = `
    applied_reward_points {
      points
    }
  `;

  const [modifiedCart] = await functionExtension('getRewardPoints', [rewardPoints]);

  return modifiedCart;
};
