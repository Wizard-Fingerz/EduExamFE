import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Stack,
  Switch,
  FormControlLabel,
  Slider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Alert,
  Snackbar,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Tabs,
  Tab,
  LinearProgress,
} from '@mui/material';
import {
  Accessibility as AccessibilityIcon,
  Speed as SpeedIcon,
  School as SchoolIcon,
  Notifications as NotificationsIcon,
  ColorLens as ThemeIcon,
  Save as SaveIcon,
  Language as LanguageIcon,
  Security as SecurityIcon,
  Backup as BackupIcon,
  Tune as TuneIcon,
  Keyboard as KeyboardIcon,
  Palette as PaletteIcon,
  Timer as TimerIcon,
  Sync as SyncIcon,
} from '@mui/icons-material';

interface SettingsState {
  accessibility: {
    extendedTime: boolean;
    largerText: boolean;
    highContrast: boolean;
    screenReader: boolean;
    simplifiedInterface: boolean;
    colorBlindMode: boolean;
    keyboardNavigation: boolean;
    textToSpeech: boolean;
    cursorSize: string;
    focusHighlight: boolean;
    autoScroll: boolean;
    readingGuide: boolean;
    dyslexiaFont: boolean;
  };
  learning: {
    difficultyLevel: number;
    pacePreference: string;
    autoHints: boolean;
    showProgressIndicators: boolean;
    adaptiveFeedback: boolean;
    preferredSubjects: string[];
    studyReminders: boolean;
    dailyGoals: number;
    breakReminders: boolean;
    breakInterval: number;
    reviewFrequency: string;
    practiceMode: string;
    gamification: boolean;
    showTimer: boolean;
    autoResume: boolean;
    spellCheck: boolean;
  };
  notifications: {
    examReminders: boolean;
    progressUpdates: boolean;
    newContentAlerts: boolean;
    feedbackNotifications: boolean;
    emailDigest: string;
    pushNotifications: boolean;
    quietHours: {
      enabled: boolean;
      start: string;
      end: string;
    };
    soundEffects: boolean;
    vibration: boolean;
    desktopNotifications: boolean;
    urgentAlerts: boolean;
    achievementAlerts: boolean;
  };
  theme: {
    mode: string;
    primaryColor: string;
    fontSize: string;
    density: string;
    animations: boolean;
    customFonts: boolean;
    borderRadius: string;
    iconStyle: string;
  };
  language: {
    preferred: string;
    fallback: string;
    dictionary: boolean;
    translator: boolean;
    spellcheck: boolean;
    grammarCheck: boolean;
  };
  privacy: {
    shareProgress: boolean;
    shareProfile: boolean;
    dataCollection: boolean;
    analytics: boolean;
    thirdPartyContent: boolean;
    locationServices: boolean;
    autoBackup: boolean;
    dataDeletion: string;
  };
  sync: {
    autoSync: boolean;
    syncInterval: number;
    syncOnWifiOnly: boolean;
    deviceSync: boolean;
    cloudBackup: boolean;
    offlineMode: boolean;
  };
  performance: {
    hardwareAcceleration: boolean;
    cacheSize: number;
    autoCleanup: boolean;
    backgroundProcessing: boolean;
    powerSaving: boolean;
  };
}

export const Settings: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [settings, setSettings] = useState<SettingsState>({
    accessibility: {
      extendedTime: true,
      largerText: false,
      highContrast: false,
      screenReader: false,
      simplifiedInterface: true,
      colorBlindMode: false,
      keyboardNavigation: true,
      textToSpeech: false,
      cursorSize: 'medium',
      focusHighlight: true,
      autoScroll: false,
      readingGuide: false,
      dyslexiaFont: false,
    },
    learning: {
      difficultyLevel: 2,
      pacePreference: 'medium',
      autoHints: true,
      showProgressIndicators: true,
      adaptiveFeedback: true,
      preferredSubjects: [],
      studyReminders: true,
      dailyGoals: 30,
      breakReminders: true,
      breakInterval: 45,
      reviewFrequency: 'weekly',
      practiceMode: 'standard',
      gamification: true,
      showTimer: true,
      autoResume: true,
      spellCheck: true,
    },
    notifications: {
      examReminders: true,
      progressUpdates: true,
      newContentAlerts: false,
      feedbackNotifications: true,
      emailDigest: 'weekly',
      pushNotifications: true,
      quietHours: {
        enabled: false,
        start: '22:00',
        end: '07:00'
      },
      soundEffects: true,
      vibration: true,
      desktopNotifications: true,
      urgentAlerts: true,
      achievementAlerts: true,
    },
    theme: {
      mode: 'light',
      primaryColor: 'blue',
      fontSize: 'medium',
      density: 'comfortable',
      animations: true,
      customFonts: false,
      borderRadius: 'medium',
      iconStyle: 'filled',
    },
    language: {
      preferred: 'en',
      fallback: 'en',
      dictionary: true,
      translator: false,
      spellcheck: true,
      grammarCheck: true,
    },
    privacy: {
      shareProgress: false,
      shareProfile: true,
      dataCollection: true,
      analytics: true,
      thirdPartyContent: false,
      locationServices: false,
      autoBackup: true,
      dataDeletion: 'manual',
    },
    sync: {
      autoSync: true,
      syncInterval: 30,
      syncOnWifiOnly: true,
      deviceSync: true,
      cloudBackup: true,
      offlineMode: false,
    },
    performance: {
      hardwareAcceleration: true,
      cacheSize: 500,
      autoCleanup: true,
      backgroundProcessing: true,
      powerSaving: false,
    }
  });

  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);
  const [showBackupDialog, setShowBackupDialog] = useState(false);

  useEffect(() => {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleSettingChange = (category: keyof SettingsState, setting: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value,
      },
    }));
  };

  const handleNestedSettingChange = (category: keyof SettingsState, parent: string, setting: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [parent]: {
          ...(prev[category] as any)[parent],
          [setting]: value,
        },
      },
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      localStorage.setItem('userSettings', JSON.stringify(settings));
      setShowSaveSuccess(true);
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleBackup = async () => {
    setShowBackupDialog(true);
    for (let i = 0; i <= 100; i += 10) {
      setBackupProgress(i);
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    setShowBackupDialog(false);
    setBackupProgress(0);
  };

  const handleReset = () => {
    setShowResetDialog(true);
  };

  const confirmReset = () => {
    localStorage.removeItem('userSettings');
    // Reset to default settings...
    setShowResetDialog(false);
  };

  const handleExportSettings = async () => {
    try {
      const settingsBlob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(settingsBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'learning-settings.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export settings:', error);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Stack spacing={4}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h4">Settings</Typography>
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<BackupIcon />}
              onClick={handleBackup}
            >
              Backup
            </Button>
            <Button
              variant="outlined"
              onClick={handleExportSettings}
            >
              Export
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={handleReset}
            >
              Reset
            </Button>
            <Button
              variant="contained"
              startIcon={isSaving ? <CircularProgress size={24} /> : <SaveIcon />}
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save All Settings'}
            </Button>
          </Stack>
        </Stack>

        <Paper sx={{ borderRadius: 2 }}>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab icon={<AccessibilityIcon />} label="Accessibility" />
            <Tab icon={<SchoolIcon />} label="Learning" />
            <Tab icon={<NotificationsIcon />} label="Notifications" />
            <Tab icon={<ThemeIcon />} label="Appearance" />
            <Tab icon={<LanguageIcon />} label="Language" />
            <Tab icon={<SecurityIcon />} label="Privacy" />
            <Tab icon={<SyncIcon />} label="Sync" />
            <Tab icon={<TuneIcon />} label="Performance" />
          </Tabs>

          <Box sx={{ p: 3 }}>
            {/* Accessibility Tab */}
            {currentTab === 0 && (
              <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap>
                <Box flex={1} minWidth={300}>
                  <Card>
                    <CardContent>
                      <Stack spacing={3}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <AccessibilityIcon color="primary" />
                          <Typography variant="h6">Visual Adjustments</Typography>
                        </Stack>
                        <Stack spacing={2}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={settings.accessibility.largerText}
                                onChange={(e) => handleSettingChange('accessibility', 'largerText', e.target.checked)}
                              />
                            }
                            label="Larger Text Size"
                          />
                          <FormControlLabel
                            control={
                              <Switch
                                checked={settings.accessibility.highContrast}
                                onChange={(e) => handleSettingChange('accessibility', 'highContrast', e.target.checked)}
                              />
                            }
                            label="High Contrast"
                          />
                          <FormControlLabel
                            control={
                              <Switch
                                checked={settings.accessibility.colorBlindMode}
                                onChange={(e) => handleSettingChange('accessibility', 'colorBlindMode', e.target.checked)}
                              />
                            }
                            label="Color Blind Mode"
                          />
                          <FormControl fullWidth>
                            <InputLabel>Cursor Size</InputLabel>
                            <Select
                              value={settings.accessibility.cursorSize}
                              onChange={(e) => handleSettingChange('accessibility', 'cursorSize', e.target.value)}
                            >
                              <MenuItem value="small">Small</MenuItem>
                              <MenuItem value="medium">Medium</MenuItem>
                              <MenuItem value="large">Large</MenuItem>
                            </Select>
                          </FormControl>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                </Box>

                <Box flex={1} minWidth={300}>
                  <Card>
                    <CardContent>
                      <Stack spacing={3}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <KeyboardIcon color="primary" />
                          <Typography variant="h6">Input & Navigation</Typography>
                        </Stack>
                        <Stack spacing={2}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={settings.accessibility.keyboardNavigation}
                                onChange={(e) => handleSettingChange('accessibility', 'keyboardNavigation', e.target.checked)}
                              />
                            }
                            label="Keyboard Navigation"
                          />
                          <FormControlLabel
                            control={
                              <Switch
                                checked={settings.accessibility.screenReader}
                                onChange={(e) => handleSettingChange('accessibility', 'screenReader', e.target.checked)}
                              />
                            }
                            label="Screen Reader Support"
                          />
                          <FormControlLabel
                            control={
                              <Switch
                                checked={settings.accessibility.textToSpeech}
                                onChange={(e) => handleSettingChange('accessibility', 'textToSpeech', e.target.checked)}
                              />
                            }
                            label="Text to Speech"
                          />
                          <FormControlLabel
                            control={
                              <Switch
                                checked={settings.accessibility.focusHighlight}
                                onChange={(e) => handleSettingChange('accessibility', 'focusHighlight', e.target.checked)}
                              />
                            }
                            label="Focus Highlighting"
                          />
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                </Box>

                <Box flex={1} minWidth={300}>
                  <Card>
                    <CardContent>
                      <Stack spacing={3}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <SpeedIcon color="primary" />
                          <Typography variant="h6">Reading & Learning</Typography>
                        </Stack>
                        <Stack spacing={2}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={settings.accessibility.extendedTime}
                                onChange={(e) => handleSettingChange('accessibility', 'extendedTime', e.target.checked)}
                              />
                            }
                            label="Extended Time"
                          />
                          <FormControlLabel
                            control={
                              <Switch
                                checked={settings.accessibility.autoScroll}
                                onChange={(e) => handleSettingChange('accessibility', 'autoScroll', e.target.checked)}
                              />
                            }
                            label="Auto-Scroll"
                          />
                          <FormControlLabel
                            control={
                              <Switch
                                checked={settings.accessibility.readingGuide}
                                onChange={(e) => handleSettingChange('accessibility', 'readingGuide', e.target.checked)}
                              />
                            }
                            label="Reading Guide"
                          />
                          <FormControlLabel
                            control={
                              <Switch
                                checked={settings.accessibility.dyslexiaFont}
                                onChange={(e) => handleSettingChange('accessibility', 'dyslexiaFont', e.target.checked)}
                              />
                            }
                            label="Dyslexia-Friendly Font"
                          />
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                </Box>
              </Stack>
            )}

            {/* Learning Tab */}
            {currentTab === 1 && (
              <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap>
                <Box flex={1} minWidth={300}>
                  <Card>
                    <CardContent>
                      <Stack spacing={3}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <SchoolIcon color="primary" />
                          <Typography variant="h6">Learning Preferences</Typography>
                        </Stack>
                        <Stack spacing={2}>
                          <FormControl fullWidth>
                            <Typography gutterBottom>Difficulty Level</Typography>
                            <Slider
                              value={settings.learning.difficultyLevel}
                              onChange={(_e, value) => handleSettingChange('learning', 'difficultyLevel', value)}
                              min={1}
                              max={5}
                              marks
                              valueLabelDisplay="auto"
                            />
                          </FormControl>
                          <FormControl fullWidth>
                            <InputLabel>Pace Preference</InputLabel>
                            <Select
                              value={settings.learning.pacePreference}
                              onChange={(e) => handleSettingChange('learning', 'pacePreference', e.target.value)}
                            >
                              <MenuItem value="slow">Slow</MenuItem>
                              <MenuItem value="medium">Medium</MenuItem>
                              <MenuItem value="fast">Fast</MenuItem>
                            </Select>
                          </FormControl>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={settings.learning.autoHints}
                                onChange={(e) => handleSettingChange('learning', 'autoHints', e.target.checked)}
                              />
                            }
                            label="Automatic Hints"
                          />
                          <FormControlLabel
                            control={
                              <Switch
                                checked={settings.learning.adaptiveFeedback}
                                onChange={(e) => handleSettingChange('learning', 'adaptiveFeedback', e.target.checked)}
                              />
                            }
                            label="Adaptive Feedback"
                          />
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                </Box>

                <Box flex={1} minWidth={300}>
                  <Card>
                    <CardContent>
                      <Stack spacing={3}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <TimerIcon color="primary" />
                          <Typography variant="h6">Study Schedule</Typography>
                        </Stack>
                        <Stack spacing={2}>
                          <FormControl fullWidth>
                            <Typography gutterBottom>Daily Study Goal (minutes)</Typography>
                            <Slider
                              value={settings.learning.dailyGoals}
                              onChange={(_e, value) => handleSettingChange('learning', 'dailyGoals', value)}
                              min={15}
                              max={120}
                              step={15}
                              marks
                              valueLabelDisplay="auto"
                            />
                          </FormControl>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={settings.learning.breakReminders}
                                onChange={(e) => handleSettingChange('learning', 'breakReminders', e.target.checked)}
                              />
                            }
                            label="Break Reminders"
                          />
                          <FormControl fullWidth>
                            <Typography gutterBottom>Break Interval (minutes)</Typography>
                            <Slider
                              value={settings.learning.breakInterval}
                              onChange={(_e, value) => handleSettingChange('learning', 'breakInterval', value)}
                              min={15}
                              max={60}
                              step={5}
                              marks
                              valueLabelDisplay="auto"
                              disabled={!settings.learning.breakReminders}
                            />
                          </FormControl>
                          <FormControl fullWidth>
                            <InputLabel>Review Frequency</InputLabel>
                            <Select
                              value={settings.learning.reviewFrequency}
                              onChange={(e) => handleSettingChange('learning', 'reviewFrequency', e.target.value)}
                            >
                              <MenuItem value="daily">Daily</MenuItem>
                              <MenuItem value="weekly">Weekly</MenuItem>
                              <MenuItem value="monthly">Monthly</MenuItem>
                            </Select>
                          </FormControl>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                </Box>

                <Box flex={1} minWidth={300}>
                  <Card>
                    <CardContent>
                      <Stack spacing={3}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <TuneIcon color="primary" />
                          <Typography variant="h6">Learning Features</Typography>
                        </Stack>
                        <Stack spacing={2}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={settings.learning.gamification}
                                onChange={(e) => handleSettingChange('learning', 'gamification', e.target.checked)}
                              />
                            }
                            label="Gamification"
                          />
                          <FormControlLabel
                            control={
                              <Switch
                                checked={settings.learning.showTimer}
                                onChange={(e) => handleSettingChange('learning', 'showTimer', e.target.checked)}
                              />
                            }
                            label="Show Timer"
                          />
                          <FormControlLabel
                            control={
                              <Switch
                                checked={settings.learning.autoResume}
                                onChange={(e) => handleSettingChange('learning', 'autoResume', e.target.checked)}
                              />
                            }
                            label="Auto-Resume"
                          />
                          <FormControlLabel
                            control={
                              <Switch
                                checked={settings.learning.spellCheck}
                                onChange={(e) => handleSettingChange('learning', 'spellCheck', e.target.checked)}
                              />
                            }
                            label="Spell Check"
                          />
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                </Box>
              </Stack>
            )}

            {/* Notifications Tab */}
            {currentTab === 2 && (
              <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap>
                <Box flex={1} minWidth={300}>
                  <Card>
                    <CardContent>
                      <Stack spacing={3}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <NotificationsIcon color="primary" />
                          <Typography variant="h6">General Notifications</Typography>
                        </Stack>
                        <Stack spacing={2}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={settings.notifications.examReminders}
                                onChange={(e) => handleSettingChange('notifications', 'examReminders', e.target.checked)}
                              />
                            }
                            label="Exam Reminders"
                          />
                          <FormControlLabel
                            control={
                              <Switch
                                checked={settings.notifications.progressUpdates}
                                onChange={(e) => handleSettingChange('notifications', 'progressUpdates', e.target.checked)}
                              />
                            }
                            label="Progress Updates"
                          />
                          <FormControlLabel
                            control={
                              <Switch
                                checked={settings.notifications.newContentAlerts}
                                onChange={(e) => handleSettingChange('notifications', 'newContentAlerts', e.target.checked)}
                              />
                            }
                            label="New Content Alerts"
                          />
                          <FormControlLabel
                            control={
                              <Switch
                                checked={settings.notifications.feedbackNotifications}
                                onChange={(e) => handleSettingChange('notifications', 'feedbackNotifications', e.target.checked)}
                              />
                            }
                            label="Feedback Notifications"
                          />
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                </Box>

                <Box flex={1} minWidth={300}>
                  <Card>
                    <CardContent>
                      <Stack spacing={3}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <TimerIcon color="primary" />
                          <Typography variant="h6">Quiet Hours</Typography>
                        </Stack>
                        <Stack spacing={2}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={settings.notifications.quietHours.enabled}
                                onChange={(e) => handleNestedSettingChange('notifications', 'quietHours', 'enabled', e.target.checked)}
                              />
                            }
                            label="Enable Quiet Hours"
                          />
                          <TextField
                            label="Start Time"
                            type="time"
                            value={settings.notifications.quietHours.start}
                            onChange={(e) => handleNestedSettingChange('notifications', 'quietHours', 'start', e.target.value)}
                            disabled={!settings.notifications.quietHours.enabled}
                            fullWidth
                          />
                          <TextField
                            label="End Time"
                            type="time"
                            value={settings.notifications.quietHours.end}
                            onChange={(e) => handleNestedSettingChange('notifications', 'quietHours', 'end', e.target.value)}
                            disabled={!settings.notifications.quietHours.enabled}
                            fullWidth
                          />
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                </Box>

                <Box flex={1} minWidth={300}>
                  <Card>
                    <CardContent>
                      <Stack spacing={3}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <TuneIcon color="primary" />
                          <Typography variant="h6">Notification Settings</Typography>
                        </Stack>
                        <Stack spacing={2}>
                          <FormControl fullWidth>
                            <InputLabel>Email Digest</InputLabel>
                            <Select
                              value={settings.notifications.emailDigest}
                              onChange={(e) => handleSettingChange('notifications', 'emailDigest', e.target.value)}
                            >
                              <MenuItem value="daily">Daily</MenuItem>
                              <MenuItem value="weekly">Weekly</MenuItem>
                              <MenuItem value="monthly">Monthly</MenuItem>
                              <MenuItem value="never">Never</MenuItem>
                            </Select>
                          </FormControl>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={settings.notifications.pushNotifications}
                                onChange={(e) => handleSettingChange('notifications', 'pushNotifications', e.target.checked)}
                              />
                            }
                            label="Push Notifications"
                          />
                          <FormControlLabel
                            control={
                              <Switch
                                checked={settings.notifications.soundEffects}
                                onChange={(e) => handleSettingChange('notifications', 'soundEffects', e.target.checked)}
                              />
                            }
                            label="Sound Effects"
                          />
                          <FormControlLabel
                            control={
                              <Switch
                                checked={settings.notifications.vibration}
                                onChange={(e) => handleSettingChange('notifications', 'vibration', e.target.checked)}
                              />
                            }
                            label="Vibration"
                          />
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                </Box>
              </Stack>
            )}

            {/* Appearance Tab */}
            {currentTab === 3 && (
              <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap>
                <Box flex={1} minWidth={300}>
                  <Card>
                    <CardContent>
                      <Stack spacing={3}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <PaletteIcon color="primary" />
                          <Typography variant="h6">Theme Settings</Typography>
                        </Stack>
                        <Stack spacing={2}>
                          <FormControl fullWidth>
                            <InputLabel>Theme Mode</InputLabel>
                            <Select
                              value={settings.theme.mode}
                              onChange={(e) => handleSettingChange('theme', 'mode', e.target.value)}
                            >
                              <MenuItem value="light">Light</MenuItem>
                              <MenuItem value="dark">Dark</MenuItem>
                              <MenuItem value="system">System Default</MenuItem>
                            </Select>
                          </FormControl>
                          <FormControl fullWidth>
                            <InputLabel>Primary Color</InputLabel>
                            <Select
                              value={settings.theme.primaryColor}
                              onChange={(e) => handleSettingChange('theme', 'primaryColor', e.target.value)}
                            >
                              <MenuItem value="blue">Blue</MenuItem>
                              <MenuItem value="purple">Purple</MenuItem>
                              <MenuItem value="green">Green</MenuItem>
                              <MenuItem value="orange">Orange</MenuItem>
                            </Select>
                          </FormControl>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={settings.theme.animations}
                                onChange={(e) => handleSettingChange('theme', 'animations', e.target.checked)}
                              />
                            }
                            label="Enable Animations"
                          />
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                </Box>
              </Stack>
            )}
          </Box>
        </Paper>
      </Stack>

      {/* Dialogs */}
      <Dialog
        open={showResetDialog}
        onClose={() => setShowResetDialog(false)}
      >
        <DialogTitle>Reset Settings</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to reset all settings to their default values? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowResetDialog(false)}>Cancel</Button>
          <Button onClick={confirmReset} color="error">Reset</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showBackupDialog}
        onClose={() => setShowBackupDialog(false)}
      >
        <DialogTitle>Backing Up Settings</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ minWidth: 300, p: 2 }}>
            <LinearProgress variant="determinate" value={backupProgress} />
            <Typography align="center">{backupProgress}% Complete</Typography>
          </Stack>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={showSaveSuccess}
        autoHideDuration={6000}
        onClose={() => setShowSaveSuccess(false)}
      >
        <Alert severity="success" onClose={() => setShowSaveSuccess(false)}>
          Settings saved successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};