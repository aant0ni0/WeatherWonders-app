export type RootStackParamList = {
  Tabs: undefined;
  LocationSelect: undefined;
  Radar: undefined;
};
export type RootTabsParamList = {
  TodayScreen: { today: boolean };
  TomorrowScreen: { today: boolean };
  FiveDays: undefined;
};

export interface RootState {
  city: string;
}
