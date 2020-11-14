function ClockSettings(props) {
  return (
    <Page>
      <Section
        title={<Text bold align="center">Clock Settings</Text>}>
        <Toggle
          settingsKey="hourlyStats"
          label="Hourly Stats"
        />
      </Section>
    </Page>
  );
}

registerSettingsPage(ClockSettings);
