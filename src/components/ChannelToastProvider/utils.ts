export function makeChannel(userId: number): string {
  return `notification-channel-${userId}`;
}
