export interface Campsite {
  id: string;
  name: string;
  description: string;
  isPremium: boolean;
  isBooked: boolean;
  bookedByTeam?: string;
  bookedByNickname?: string;
}

export interface Reservation {
  id: string;
  spotId: string;
  spotName: string;
  teamNumber: string;
  nickname: string;
  timestamp: string;
}

export interface WaitingListEntry {
  id: string;
  teamNumber: string;
  nickname: string;
  timestamp: string;
  spotId: string;
  spotName: string;
}

export interface RedTeamAttack {
  id: string;
  title: string;
  prompt: string;
  description: string;
  defenseRuleName: string;
}

export interface AIDecision {
  isViolation: boolean;
  ruleName: string;
  explanation: string;
  action: "reserve" | "waitlist_suggest" | "reject" | "answer";
  targetSpotId: string | null;
}
