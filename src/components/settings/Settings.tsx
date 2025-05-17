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
  useTheme,
  useMediaQuery,
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
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

  const tabIcons = [
    <AccessibilityIcon />,
    <SchoolIcon />,
    <NotificationsIcon />,
    <ThemeIcon />,
    <LanguageIcon />,
    <SecurityIcon />,
    <SyncIcon />,
    <TuneIcon />
  ];

  const tabLabels = [
    'Accessibility',
    'Learning',
    'Notifications',
    'Appearance',
    'Language',
    'Privacy',
    'Sync',
    'Performance'
  ];

  
  return (
    <Box sx={{ 
      width: '100%', 
      maxWidth: '100%',
      p: { xs: 0, sm: 2, md: 3 }
    }}>
      <Stack spacing={{ xs: 0, sm: 3, md: 4 }}>
        {/* Header Section */}
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          justifyContent="space-between" 
          alignItems={{ xs: 'stretch', sm: 'center' }}
          spacing={{ xs: 1, sm: 2 }}
          sx={{ 
            width: '100%',
            px: { xs: 1.5, sm: 0 },
            py: { xs: 1, sm: 0 }
          }}
        >
          <Typography variant="h4" sx={{ 
            fontSize: { xs: '1.25rem', sm: '2rem' },
            fontWeight: 500
          }}>
            Settings
          </Typography>
          
          <Stack 
            direction={{ xs: 'row', sm: 'row' }} 
            spacing={{ xs: 0.5, sm: 2 }}
            sx={{ 
              width: '100%',
              flexWrap: 'wrap',
              gap: 0.75
            }}
          >
            <Button
              variant="outlined"
              startIcon={<BackupIcon />}
              onClick={handleBackup}
              size="small"
              sx={{ 
                flex: { xs: '1 1 calc(50% - 6px)', sm: '0 1 auto' },
                fontSize: '0.75rem'
              }}
            >
              Backup
            </Button>
            <Button
              variant="outlined"
              onClick={handleExportSettings}
              size="small"
              sx={{ 
                flex: { xs: '1 1 calc(50% - 6px)', sm: '0 1 auto' },
                fontSize: '0.75rem'
              }}
            >
              Export
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={handleReset}
              size="small"
              sx={{ 
                flex: { xs: '1 1 calc(50% - 6px)', sm: '0 1 auto' },
                fontSize: '0.75rem'
              }}
            >
              Reset
            </Button>
            <Button
              variant="contained"
              startIcon={isSaving ? <CircularProgress size={16} /> : <SaveIcon sx={{ fontSize: '1.1rem' }} />}
              onClick={handleSave}
              disabled={isSaving}
              size="small"
              sx={{ 
                flex: { xs: '1 1 calc(50% - 6px)', sm: '0 1 auto' },
                fontSize: '0.75rem'
              }}
            >
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </Stack>
        </Stack>

        {/* Main Content */}
        <Paper 
          sx={{ 
            borderRadius: { xs: 0, sm: 2 },
            overflow: 'hidden',
            width: '100%',
            boxShadow: { xs: 'none', sm: 1 }
          }}
        >
          <Box 
            sx={{ 
              overflowX: 'auto',
              width: '100%',
              bgcolor: 'background.paper',
              borderBottom: 1,
              borderColor: 'divider',
              '&::-webkit-scrollbar': {
                display: 'none'
              }
            }}
          >
            <Tabs
              value={currentTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons={false}
              sx={{ 
                minHeight: 36,
                px: { xs: 0.5, sm: 0 },
                '& .MuiTab-root': {
                  minHeight: 36,
                  py: 0.25,
                  px: { xs: 1, sm: 2 },
                  minWidth: 'unset',
                  '& .MuiSvgIcon-root': {
                    fontSize: '1.1rem'
                  }
                }
              }}
            >
              {tabLabels.map((label, index) => (
                <Tab 
                  key={index} 
                  icon={tabIcons[index]} 
                  label={isMobile ? null : label}
                  aria-label={label}
                  sx={{
                    fontSize: '0.7rem'
                  }}
                />
              ))}
            </Tabs>
          </Box>

          <Box sx={{ 
            p: { xs: 1.5, sm: 3 },
            '& .MuiCard-root': {
              width: '100%',
              boxShadow: 'none',
              '&:not(:last-child)': {
                borderBottom: '1px solid',
                borderColor: 'divider'
              }
            },
            '& .MuiCardContent-root': {
              p: { xs: 1.5, sm: 3 },
              '&:last-child': {
                pb: { xs: 1.5, sm: 3 }
              }
            }
          }}>
            {/* Accessibility Tab */}
            {currentTab === 0 && (
              <Stack spacing={{ xs: 2, sm: 3 }}>
                <Card>
                  <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                    <Stack spacing={{ xs: 2, sm: 3 }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <AccessibilityIcon color="primary" />
                        <Typography variant="h6" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
                          Visual Adjustments
                        </Typography>
                      </Stack>
                      <Stack spacing={{ xs: 1.5, sm: 2 }}>
                        <FormControlLabel
                          sx={{ m: 0 }}
                          control={
                            <Switch
                              checked={settings.accessibility.largerText}
                              onChange={(e) => handleSettingChange('accessibility', 'largerText', e.target.checked)}
                            />
                          }
                          label={
                            <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                              Larger Text Size
                            </Typography>
                          }
                        />
                        <FormControlLabel
                          sx={{ m: 0 }}
                          control={
                            <Switch
                              checked={settings.accessibility.highContrast}
                              onChange={(e) => handleSettingChange('accessibility', 'highContrast', e.target.checked)}
                            />
                          }
                          label={
                            <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                              High Contrast
                            </Typography>
                          }
                        />
                        <FormControlLabel
                          sx={{ m: 0 }}
                          control={
                            <Switch
                              checked={settings.accessibility.colorBlindMode}
                              onChange={(e) => handleSettingChange('accessibility', 'colorBlindMode', e.target.checked)}
                            />
                          }
                          label={
                            <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                              Color Blind Mode
                            </Typography>
                          }
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

                <Card>
                  <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                    <Stack spacing={{ xs: 2, sm: 3 }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <KeyboardIcon color="primary" />
                        <Typography variant="h6" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
                          Input & Navigation
                        </Typography>
                      </Stack>
                      <Stack spacing={{ xs: 1.5, sm: 2 }}>
                        <FormControlLabel
                          sx={{ m: 0 }}
                          control={
                            <Switch
                              checked={settings.accessibility.keyboardNavigation}
                              onChange={(e) => handleSettingChange('accessibility', 'keyboardNavigation', e.target.checked)}
                            />
                          }
                          label={
                            <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                              Keyboard Navigation
                            </Typography>
                          }
                        />
                        <FormControlLabel
                          sx={{ m: 0 }}
                          control={
                            <Switch
                              checked={settings.accessibility.screenReader}
                              onChange={(e) => handleSettingChange('accessibility', 'screenReader', e.target.checked)}
                            />
                          }
                          label={
                            <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                              Screen Reader Support
                            </Typography>
                          }
                        />
                        <FormControlLabel
                          sx={{ m: 0 }}
                          control={
                            <Switch
                              checked={settings.accessibility.textToSpeech}
                              onChange={(e) => handleSettingChange('accessibility', 'textToSpeech', e.target.checked)}
                            />
                          }
                          label={
                            <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                              Text to Speech
                            </Typography>
                          }
                        />
                        <FormControlLabel
                          sx={{ m: 0 }}
                          control={
                            <Switch
                              checked={settings.accessibility.focusHighlight}
                              onChange={(e) => handleSettingChange('accessibility', 'focusHighlight', e.target.checked)}
                            />
                          }
                          label={
                            <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                              Focus Highlighting
                            </Typography>
                          }
                        />
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                    <Stack spacing={{ xs: 2, sm: 3 }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <SpeedIcon color="primary" />
                        <Typography variant="h6" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
                          Reading & Learning
                        </Typography>
                      </Stack>
                      <Stack spacing={{ xs: 1.5, sm: 2 }}>
                        <FormControlLabel
                          sx={{ m: 0 }}
                          control={
                            <Switch
                              checked={settings.accessibility.extendedTime}
                              onChange={(e) => handleSettingChange('accessibility', 'extendedTime', e.target.checked)}
                            />
                          }
                          label={
                            <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                              Extended Time
                            </Typography>
                          }
                        />
                        <FormControlLabel
                          sx={{ m: 0 }}
                          control={
                            <Switch
                              checked={settings.accessibility.autoScroll}
                              onChange={(e) => handleSettingChange('accessibility', 'autoScroll', e.target.checked)}
                            />
                          }
                          label={
                            <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                              Auto-Scroll
                            </Typography>
                          }
                        />
                        <FormControlLabel
                          sx={{ m: 0 }}
                          control={
                            <Switch
                              checked={settings.accessibility.readingGuide}
                              onChange={(e) => handleSettingChange('accessibility', 'readingGuide', e.target.checked)}
                            />
                          }
                          label={
                            <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                              Reading Guide
                            </Typography>
                          }
                        />
                        <FormControlLabel
                          sx={{ m: 0 }}
                          control={
                            <Switch
                              checked={settings.accessibility.dyslexiaFont}
                              onChange={(e) => handleSettingChange('accessibility', 'dyslexiaFont', e.target.checked)}
                            />
                          }
                          label={
                            <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                              Dyslexia-Friendly Font
                            </Typography>
                          }
                        />
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Stack>
            )}

            {/* Learning Tab */}
            {currentTab === 1 && (
              <Stack spacing={{ xs: 2, sm: 3 }}>
                <Card>
                  <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                    <Stack spacing={{ xs: 2, sm: 3 }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <SchoolIcon color="primary" />
                        <Typography variant="h6" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
                          Learning Preferences
                        </Typography>
                      </Stack>
                      <Stack spacing={{ xs: 1.5, sm: 2 }}>
                        <FormControl fullWidth>
                          <Typography gutterBottom sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                            Difficulty Level
                          </Typography>
                          <Slider
                            value={settings.learning.difficultyLevel}
                            onChange={(_e, value) => handleSettingChange('learning', 'difficultyLevel', value)}
                            min={1}
                            max={5}
                            marks
                            valueLabelDisplay="auto"
                            sx={{ mt: 1 }}
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

                <Card>
                  <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                    <Stack spacing={{ xs: 2, sm: 3 }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <TimerIcon color="primary" />
                        <Typography variant="h6" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
                          Study Schedule
                        </Typography>
                      </Stack>
                      <Stack spacing={{ xs: 1.5, sm: 2 }}>
                        <FormControl fullWidth>
                          <Typography gutterBottom sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                            Daily Study Goal (minutes)
                          </Typography>
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
                          <Typography gutterBottom sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                            Break Interval (minutes)
                          </Typography>
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

                <Card>
                  <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                    <Stack spacing={{ xs: 2, sm: 3 }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <TuneIcon color="primary" />
                        <Typography variant="h6" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
                          Learning Features
                        </Typography>
                      </Stack>
                      <Stack spacing={{ xs: 1.5, sm: 2 }}>
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
              </Stack>
            )}

            {/* Notifications Tab */}
            {currentTab === 2 && (
              <Stack spacing={{ xs: 2, sm: 3 }}>
                <Card>
                  <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                    <Stack spacing={{ xs: 2, sm: 3 }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <NotificationsIcon color="primary" />
                        <Typography variant="h6" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
                          General Notifications
                        </Typography>
                      </Stack>
                      <Stack spacing={{ xs: 1.5, sm: 2 }}>
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

                <Card>
                  <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                    <Stack spacing={{ xs: 2, sm: 3 }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <TimerIcon color="primary" />
                        <Typography variant="h6" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
                          Quiet Hours
                        </Typography>
                      </Stack>
                      <Stack spacing={{ xs: 1.5, sm: 2 }}>
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

                <Card>
                  <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                    <Stack spacing={{ xs: 2, sm: 3 }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <TuneIcon color="primary" />
                        <Typography variant="h6" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
                          Notification Settings
                        </Typography>
                      </Stack>
                      <Stack spacing={{ xs: 1.5, sm: 2 }}>
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
              </Stack>
            )}

            {/* Appearance Tab */}
            {currentTab === 3 && (
              <Stack spacing={{ xs: 2, sm: 3 }}>
                <Card>
                  <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                    <Stack spacing={{ xs: 2, sm: 3 }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <PaletteIcon color="primary" />
                        <Typography variant="h6" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
                          Theme Settings
                        </Typography>
                      </Stack>
                      <Stack spacing={{ xs: 1.5, sm: 2 }}>
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