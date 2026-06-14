import React, { useState, useEffect } from 'react';
import {
  Flame, ShieldCheck, Check, Music, HeartHandshake, Camera, Briefcase,
  Coffee, Landmark, Stethoscope, Share2, MapPin, Lock, Trophy, Award,
  GraduationCap, Home, ListChecks, User, Loader2, ArrowLeftRight,
  Microscope, Footprints, Coins, UserPlus, Crown, Sparkles, ArrowRight,
  Palette, Dumbbell, Plus, Image, FileText, Video, MessageSquare,
  UserCheck, UserX, X, BarChart3
} from 'lucide-react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
  LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line
} from 'recharts';
import { firebaseEnabled, auth, signOut } from './firebase.js';
import { GoogleSheetsService } from './GoogleSheetsService';

function GoogleIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.5 29.5 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5 43.5 34.8 43.5 24c0-1.2-.1-2.4-.3-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 16 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.5 29.5 4.5 24 4.5c-7.7 0-14.4 4.4-17.7 10.2z"/>
      <path fill="#4CAF50" d="M24 43.5c5.4 0 10.3-1.9 14-5.2l-6.4-5.4C29.6 34.4 26.9 35.5 24 35.5c-5.2 0-9.6-3.3-11.3-8l-6.6 5.1C9.5 39 16.2 43.5 24 43.5z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.2 5.6l6.4 5.4C40.9 36 43.5 30.8 43.5 24c0-1.2-.1-2.4-.3-3.5z"/>
    </svg>
  );
}

function AppleIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 384 512" fill="currentColor" aria-hidden="true">
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-19.8-28.3-50-43.9-90.4-47.1-38.1-3-79.1 22.3-94.3 22.3-15.9 0-52.2-21.3-86.9-20.7-67 .1-138 51.6-138 152.3 0 30.5 5.6 62.1 16.7 94.7 14.9 43.5 68.7 150.1 124.9 148.4 31.4-.7 53.6-22.3 94.6-22.3 39.6 0 60.1 22.3 94.6 22.3 56.7-.8 105.3-98 119.5-141.5-77.2-36.5-67.9-104.5-90.7-123.6zM257 81.6c20.5-24.2 18.6-46.3 18-54.4-17.6 1-38 12-49.2 25.7-12.6 14.7-19.9 32.9-18.3 53.3 19.1.7 38.7-9.6 49.5-24.6z"/>
    </svg>
  );
}

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore write errors (e.g. storage unavailable)
    }
  }, [key, value]);

  return [value, setValue];
}

const evidenceTypes = [
  { id: 'photo', label: 'Photo', icon: Image },
  { id: 'video', label: 'Video', icon: Video },
  { id: 'document', label: 'Document', icon: FileText },
];

const statsData = [
  { stat: 'Discipline', value: 88 },
  { stat: 'Fitness', value: 70 },
  { stat: 'Study', value: 75 },
  { stat: 'Creativity', value: 65 },
  { stat: 'Social', value: 55 },
  { stat: 'Volunteering', value: 92 },
];

const initialQuests = [
  { id: 1, title: 'Study session, 45 min', icon: Microscope, status: 'done', xp: 50, detail: 'Verified' },
  { id: 2, title: 'Morning training, 30 min', icon: Footprints, status: 'done', xp: 40, detail: 'Verified' },
  { id: 3, title: 'Read for 20 min', icon: Check, status: 'done', xp: 30, detail: 'Verified' },
  { id: 4, title: 'Piano practice, 30 min', icon: Music, status: 'progress', xp: 35, progress: 22, target: 30 },
  { id: 5, title: 'Log a volunteering shift', icon: HeartHandshake, status: 'todo', xp: 80, detail: 'Not started' },
];

const opportunities = [
  { id: 1, title: 'Vet assistant — work experience', org: 'Northside Veterinary Clinic · 5 km away', detail: '1 week placement · School holidays', match: 94, icon: Stethoscope, tier: 'high' },
  { id: 2, title: 'Cafe team member', org: 'Crema & Co · 2 km away', detail: 'Casual · Weekends', match: 78, icon: Coffee, tier: 'mid' },
  { id: 3, title: 'Youth advisory panel', org: 'City Council · Remote', detail: 'Volunteering · Monthly meetings', match: 71, icon: Landmark, tier: 'mid' },
];

const sends = [
  { id: 1, title: 'Work experience — local vet clinic', icon: Briefcase, locked: false },
  { id: 2, title: 'School science competition', icon: Trophy, locked: false },
  { id: 3, title: 'Youth volunteering award', icon: Award, locked: true, reason: 'Locked — reach volunteering 75' },
  { id: 4, title: 'University leadership program', icon: GraduationCap, locked: true, reason: 'Locked — reach level 10' },
];

const applicants = [
  { id: 1, name: 'Jamie Lin', initials: 'JL', strengths: 'Strengths: research, consistency', match: 94, tier: 'high' },
  { id: 2, name: 'Ravi Patel', initials: 'RP', strengths: 'Strengths: communication, animal care club', match: 88, tier: 'mid' },
  { id: 3, name: 'Sofia Chen', initials: 'SC', strengths: 'Strengths: time management, reliability', match: 81, tier: 'mid' },
];

const leaderboardUsers = [
  { id: 1, name: 'Sofia Chen', initials: 'SC', level: 9, coins: 5120, isFriend: true, isMe: false },
  { id: 2, name: 'Ravi Patel', initials: 'RP', level: 8, coins: 4380, isFriend: true, isMe: false },
  { id: 4, name: 'Mia Thompson', initials: 'MT', level: 7, coins: 3260, isFriend: false, isMe: false },
  { id: 5, name: 'Ethan Wu', initials: 'EW', level: 6, coins: 2840, isFriend: true, isMe: false },
  { id: 6, name: 'Layla Hassan', initials: 'LH', level: 6, coins: 2510, isFriend: false, isMe: false },
];

const yearLevels = ['Year 10', 'Year 11', 'Year 12', 'University'];

const goalOptions = [
  { id: 'science', label: 'Science & medicine', headline: 'Aspiring biomedical engineer', icon: Microscope },
  { id: 'tech', label: 'Technology & engineering', headline: 'Aspiring software engineer', icon: Sparkles },
  { id: 'creative', label: 'Creative & design', headline: 'Aspiring designer', icon: Palette },
  { id: 'business', label: 'Business & law', headline: 'Aspiring business leader', icon: Briefcase },
  { id: 'sport', label: 'Sport & health', headline: 'Aspiring sports scientist', icon: Dumbbell },
  { id: 'education', label: 'Education & teaching', headline: 'Aspiring teacher', icon: GraduationCap },
  { id: 'trades', label: 'Trades & construction', headline: 'Aspiring tradesperson', icon: Award },
  { id: 'hospitality', label: 'Hospitality & tourism', headline: 'Aspiring hospitality manager', icon: Coffee },
  { id: 'media', label: 'Media & communications', headline: 'Aspiring journalist', icon: MessageSquare },
  { id: 'social', label: 'Social sciences & psychology', headline: 'Aspiring psychologist', icon: HeartHandshake },
  { id: 'environment', label: 'Environment & agriculture', headline: 'Aspiring environmental scientist', icon: Landmark },
  { id: 'other', label: 'Other — let me type my own', headline: '', icon: Plus },
];

const industryOptions = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Retail',
  'Manufacturing',
  'Construction',
  'Hospitality',
  'Non-profit',
  'Government',
  'Other'
];

const experienceOptions = [
  '0-1 years',
  '1-3 years',
  '3-5 years',
  '5-10 years',
  '10+ years'
];

const achievements = [
  { id: 1, title: 'First streak', icon: Flame, unlocked: true },
  { id: 2, title: '50 quests verified', icon: ShieldCheck, unlocked: true },
  { id: 3, title: 'Volunteering 25h', icon: HeartHandshake, unlocked: true },
  { id: 4, title: 'Level 10', icon: Crown, unlocked: false },
  { id: 5, title: '100 day streak', icon: Trophy, unlocked: false },
  { id: 6, title: 'Top of leaderboard', icon: Sparkles, unlocked: false },
];

const inputStyle = {
  width: '100%', marginTop: 4, padding: '10px 12px', borderRadius: 10,
  border: '1px solid var(--border)', background: 'var(--bg-surface-2)',
  color: 'var(--text-primary)', fontSize: 14, fontFamily: 'var(--font-body)', boxSizing: 'border-box'
};

const primaryButtonStyle = {
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
  padding: '12px', borderRadius: 12, border: 'none', width: '100%',
  background: 'var(--accent-violet)', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer'
};

const secondaryButtonStyle = {
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
  padding: '8px 12px', borderRadius: 10, border: '1px solid var(--border)',
  background: 'var(--bg-surface-2)', color: 'var(--text-primary)', fontSize: 12, fontWeight: 600, cursor: 'pointer'
};

const questIconOptions = [
  { id: 'study', label: 'Study', icon: Microscope },
  { id: 'fitness', label: 'Fitness', icon: Footprints },
  { id: 'creative', label: 'Creative', icon: Music },
  { id: 'volunteering', label: 'Volunteering', icon: HeartHandshake },
  { id: 'reading', label: 'Reading', icon: Check },
  { id: 'work', label: 'Work', icon: Briefcase },
];

function VerificationRing({ percent, initials = 'JL', photoUrl, size = 64 }) {
  const stroke = 4;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (percent / 100) * c;
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--border)" strokeWidth={stroke} fill="none" />
        <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--accent-green)" strokeWidth={stroke}
          fill="none" strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round" />
      </svg>
      <div style={{
        position: 'absolute', inset: 6, borderRadius: '50%', background: 'var(--accent-violet)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
        color: '#fff', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16
      }}>
        {photoUrl ? <img src={photoUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials}
      </div>
    </div>
  );
}

function Pill({ children, tone = 'neutral' }) {
  const tones = {
    neutral: { bg: 'var(--bg-surface-2)', fg: 'var(--text-secondary)' },
    green: { bg: 'rgba(74,222,128,0.14)', fg: 'var(--accent-green)' },
    blue: { bg: 'rgba(95,168,232,0.14)', fg: 'var(--accent-blue)' },
    amber: { bg: 'rgba(245,169,60,0.14)', fg: 'var(--accent-amber)' },
    violet: { bg: 'rgba(139,124,246,0.14)', fg: 'var(--accent-violet)' },
  };
  const t = tones[tone];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px',
      borderRadius: 999, fontSize: 12, fontWeight: 600, background: t.bg, color: t.fg, whiteSpace: 'nowrap'
    }}>{children}</span>
  );
}

function Card({ children, style }) {
  return (
    <div style={{
      background: 'var(--bg-surface)', border: '1px solid var(--border)',
      borderRadius: 16, padding: 16, ...style
    }}>{children}</div>
  );
}

function OpusLogo({ size = 56 }) {
  return (
    <svg width={size} height={size * 1.25} viewBox="0 0 100 124" fill="none" aria-hidden="true">
      <rect x="5" y="5" width="90" height="114" rx="45" stroke="var(--accent-gold)" strokeWidth="2" />
      <rect x="11" y="11" width="78" height="102" rx="39" stroke="var(--accent-gold)" strokeWidth="1.2" />
      <text x="50" y="76" textAnchor="middle" fontFamily="var(--font-display)" fontWeight="700"
        fontSize="54" fill="var(--accent-gold)">&#937;</text>
    </svg>
  );
}

function Flourish() {
  return (
    <svg width="170" height="16" viewBox="0 0 170 16" style={{ display: 'block' }} aria-hidden="true">
      <line x1="22" y1="8" x2="148" y2="8" stroke="var(--accent-gold-dim)" strokeWidth="1" />
      <circle cx="8" cy="8" r="3" fill="none" stroke="var(--accent-gold)" strokeWidth="1.2" />
      <circle cx="162" cy="8" r="3" fill="none" stroke="var(--accent-gold)" strokeWidth="1.2" />
      <rect x="15" y="4" width="8" height="8" transform="rotate(45 19 8)" fill="none" stroke="var(--accent-gold)" strokeWidth="1.2" />
      <rect x="147" y="4" width="8" height="8" transform="rotate(45 151 8)" fill="none" stroke="var(--accent-gold)" strokeWidth="1.2" />
    </svg>
  );
}

function LevelBar({ level, xp, xpForNext }) {
  const pct = Math.min(100, Math.round((xp / xpForNext) * 100));
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Level {level}</span>
        <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{xp.toLocaleString()} / {xpForNext.toLocaleString()} XP</span>
      </div>
      <div style={{ height: 8, background: 'var(--bg-surface-2)', borderRadius: 99, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: 'var(--accent-violet)' }} />
      </div>
    </div>
  );
}


const DEMO_EMAIL = 'pitch@example.com';

const demoProfile = {
  name: 'Example Pitch', initials: 'EP', email: DEMO_EMAIL,
  year: 'Year 11', goal: 'science', customGoal: '', school: 'Demo High School',
  accountType: 'student', photoURL: null, isExample: true,
};

function AuthScreen({ onComplete }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [school, setSchool] = useState('');
  const [organization, setOrganization] = useState('');
  const [role, setRole] = useState('');
  const [industry, setIndustry] = useState('');
  const [experience, setExperience] = useState('');
  const [year, setYear] = useState('Year 11');
  const [goal, setGoal] = useState('science');
  const [customGoal, setCustomGoal] = useState('');
  const [accountType, setAccountType] = useState('student');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const initials = name.trim()
    ? name.trim().split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  const chipStyle = active => ({
    fontSize: 12, fontWeight: 600, padding: '8px 14px', borderRadius: 999,
    border: active ? '1px solid var(--accent-violet)' : '1px solid var(--border)',
    background: active ? 'rgba(139,124,246,0.16)' : 'var(--bg-surface)',
    color: active ? 'var(--accent-violet)' : 'var(--text-secondary)', cursor: 'pointer'
  });

  const buildProfile = (overrides = {}) => ({
    name: name.trim(),
    initials,
    email: email.trim(),
    year,
    goal,
    customGoal: customGoal.trim(),
    accountType,
    ...(accountType === 'student' && { school: school.trim() }),
    ...(accountType === 'business' && {
      organization: organization.trim(), role: role.trim(), industry, experience,
    }),
    photoURL: null,
    ...overrides,
  });

  const goalReady = goal !== 'other' || customGoal.trim();

  const handleContinue = () => {
    setError('');
    if (email.trim().toLowerCase() === DEMO_EMAIL) {
      onComplete({ ...demoProfile, name: name.trim() || demoProfile.name });
      return;
    }

    // Validate education email for student accounts
    if (accountType === 'student') {
      const emailLower = email.trim().toLowerCase();
      if (!emailLower.endsWith('@education.nsw.gov.au')) {
        setError('Student accounts must use an @education.nsw.gov.au email address.');
        return;
      }
    }

    setStep(1);
  };

  const handleFinish = async () => {
    setError('');
    const profileData = buildProfile();

    if (!firebaseEnabled) {
      onComplete(profileData);
      return;
    }

    setLoading(true);
    try {
      const { sendSignInLinkToEmail } = await import('./firebase.js');

      const actionCodeSettings = {
        url: window.location.origin,
        handleCodeInApp: true,
      };

      window.localStorage.setItem('emailForSignIn', email.trim());
      window.localStorage.setItem('pendingOpusProfile', JSON.stringify(profileData));

      await sendSignInLinkToEmail(auth, email.trim(), actionCodeSettings);

      setError('Check your email for the sign-in link, then open it on this same device.');
    } catch (err) {
      setError(err.message || 'Something went wrong sending the sign-in link.');
    } finally {
      setLoading(false);
    }
  };

  const handleProviderSignIn = async (providerName) => {
    if (!firebaseEnabled) {
      setError('Sign-in with Google/Apple needs Firebase set up — use the email form below for now.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const { signInWithPopup, googleProvider, appleProvider, doc, getDoc, setDoc, db } = await import('./firebase.js');
      const provider = providerName === 'google' ? googleProvider : appleProvider;
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const userRef = doc(db, 'users', user.uid);
      const snap = await getDoc(userRef);

      const derivedInitials = user.displayName
        ? user.displayName.split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase()
        : '?';

      if (snap.exists()) {
        onComplete(snap.data());
        return;
      }

      const profileData = {
        uid: user.uid,
        name: user.displayName || (user.email ? user.email.split('@')[0] : 'New user'),
        initials: derivedInitials,
        email: user.email || '',
        photoURL: user.photoURL || null,
        year: '',
        goal: '',
        customGoal: '',
        accountType: 'student',
        school: '',
        organization: '',
        role: '',
        industry: '',
        experience: '',
        needsOnboarding: true
      };
      await setDoc(userRef, profileData);
      onComplete(profileData);
    } catch (err) {
      setError(err.message || 'Sign-in failed — please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '12px 0' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, marginBottom: 4 }}>
        <OpusLogo size={40} />
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, letterSpacing: 5, color: 'var(--accent-gold)' }}>OPUS</span>
      </div>

      {step === 0 && (
        <>
          <div>
            <p style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700 }}>Create your profile</p>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-secondary)' }}>
              This is what employers and programs will see — built from verified activity, not self-written claims.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => handleProviderSignIn('google')} disabled={loading} style={{
              ...secondaryButtonStyle, flex: 1, padding: '10px', fontSize: 13, opacity: loading ? 0.6 : 1
            }}>
              <GoogleIcon size={15} /> Google
            </button>
            <button onClick={() => handleProviderSignIn('apple')} disabled={loading} style={{
              ...secondaryButtonStyle, flex: 1, padding: '10px', fontSize: 13, opacity: loading ? 0.6 : 1
            }}>
              <AppleIcon size={15} /> Apple
            </button>
          </div>
          {!firebaseEnabled && (
            <p style={{ margin: 0, fontSize: 11, color: 'var(--text-tertiary)' }}>
              Google/Apple sign-in needs Firebase configured — see README. Use the form below to continue without it.
            </p>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>OR</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>

          <div>
            <label style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Full name</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Jamie Lin" style={inputStyle} />
          </div>

          <div>
            <p style={{ margin: '0 0 8px', fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>Account type</p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setAccountType('student')} style={{
                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                padding: '12px', borderRadius: 10,
                border: accountType === 'student' ? '2px solid var(--accent-violet)' : '1px solid var(--border)',
                background: accountType === 'student' ? 'rgba(139,124,246,0.08)' : 'var(--bg-surface)',
                color: accountType === 'student' ? 'var(--accent-violet)' : 'var(--text-primary)', cursor: 'pointer'
              }}>
                <GraduationCap size={20} />
                <span style={{ fontSize: 12, fontWeight: 600 }}>Student</span>
              </button>
              <button onClick={() => setAccountType('business')} style={{
                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                padding: '12px', borderRadius: 10,
                border: accountType === 'business' ? '2px solid var(--accent-violet)' : '1px solid var(--border)',
                background: accountType === 'business' ? 'rgba(139,124,246,0.08)' : 'var(--bg-surface)',
                color: accountType === 'business' ? 'var(--accent-violet)' : 'var(--text-primary)', cursor: 'pointer'
              }}>
                <Briefcase size={20} />
                <span style={{ fontSize: 12, fontWeight: 600 }}>Business / org</span>
              </button>
            </div>
          </div>

          <div>
            <label style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="you@education.nsw.gov.au" style={inputStyle} />
          </div>

          {accountType === 'student' ? (
            <div>
              <label style={{ fontSize: 12, color: 'var(--text-secondary)' }}>School (optional)</label>
              <input value={school} onChange={e => setSchool(e.target.value)} placeholder="e.g. Northside High School" style={inputStyle} />
            </div>
          ) : (
            <>
              <div>
                <label style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Organisation</label>
                <input value={organization} onChange={e => setOrganization(e.target.value)} placeholder="e.g. Northside Vet Clinic" style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Your role</label>
                <input value={role} onChange={e => setRole(e.target.value)} placeholder="e.g. HR Manager" style={inputStyle} />
              </div>
              <div>
                <p style={{ margin: '0 0 8px', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>Industry</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {industryOptions.map(i => (
                    <button key={i} onClick={() => setIndustry(i)} style={chipStyle(industry === i)}>{i}</button>
                  ))}
                </div>
              </div>
              <div>
                <p style={{ margin: '0 0 8px', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>Years of experience</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {experienceOptions.map(exp => (
                    <button key={exp} onClick={() => setExperience(exp)} style={chipStyle(experience === exp)}>{exp}</button>
                  ))}
                </div>
              </div>
            </>
          )}

          {error && <p style={{ margin: 0, fontSize: 12, color: 'var(--accent-amber)' }}>{error}</p>}

          <button
            disabled={
              !name.trim() ||
              !email.trim() ||
              (accountType === 'student' &&
                !email.trim().toLowerCase().endsWith('@education.nsw.gov.au') &&
                email.trim().toLowerCase() !== DEMO_EMAIL)
            }
            onClick={handleContinue}
            style={{
              ...primaryButtonStyle,
              opacity: (
                !name.trim() ||
                !email.trim() ||
                (accountType === 'student' &&
                  !email.trim().toLowerCase().endsWith('@education.nsw.gov.au') &&
                  email.trim().toLowerCase() !== DEMO_EMAIL)
              ) ? 0.5 : 1
            }}
          >
            Continue <ArrowRight size={16} />
          </button>
        </>
      )}

      {step === 1 && accountType === 'student' && (
        <>
          <div>
            <p style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700 }}>Tell us about you</p>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-secondary)' }}>
              This helps tailor career guidance and match you to opportunities.
            </p>
          </div>
          <div>
            <p style={{ margin: '0 0 8px', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>What year are you in?</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {yearLevels.map(y => (
                <button key={y} onClick={() => setYear(y)} style={chipStyle(year === y)}>{y}</button>
              ))}
            </div>
          </div>
          <div>
            <p style={{ margin: '0 0 8px', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>What's your interest area?</p>
            <div style={{
              display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 220, overflowY: 'auto',
              border: '1px solid var(--border)', borderRadius: 12, padding: 6
            }}>
              {goalOptions.map(g => {
                const Icon = g.icon;
                const active = goal === g.id;
                return (
                  <button key={g.id} onClick={() => setGoal(g.id)} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 12px', borderRadius: 10, textAlign: 'left', width: '100%',
                    border: active ? '1px solid var(--accent-violet)' : '1px solid transparent',
                    background: active ? 'rgba(139,124,246,0.16)' : 'transparent',
                    color: active ? 'var(--accent-violet)' : 'var(--text-secondary)', cursor: 'pointer'
                  }}>
                    <Icon size={16} />
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{g.label}</span>
                  </button>
                );
              })}
            </div>
            {goal === 'other' && (
              <input value={customGoal} onChange={e => setCustomGoal(e.target.value)}
                placeholder="e.g. Aspiring marine biologist" style={{ ...inputStyle, marginTop: 8 }} />
            )}
          </div>

          {error && <p style={{ margin: 0, fontSize: 12, color: 'var(--accent-amber)' }}>{error}</p>}

          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => setStep(0)} style={{ ...secondaryButtonStyle, flex: 1, padding: '12px' }}>Back</button>
            <button disabled={!goalReady || loading} onClick={handleFinish} style={{ ...primaryButtonStyle, flex: 2, opacity: (!goalReady || loading) ? 0.5 : 1 }}>
              {loading ? <Loader2 size={16} className="spin" /> : <ArrowRight size={16} />}
              {loading ? 'Setting up…' : 'Get started'}
            </button>
          </div>
        </>
      )}

      {step === 1 && accountType === 'business' && (
        <>
          <div>
            <p style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700 }}>Almost done</p>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-secondary)' }}>
              Your account will let you post opportunities and review verified applicant profiles.
            </p>
          </div>
          {error && <p style={{ margin: 0, fontSize: 12, color: 'var(--accent-amber)' }}>{error}</p>}
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => setStep(0)} style={{ ...secondaryButtonStyle, flex: 1, padding: '12px' }}>Back</button>
            <button disabled={loading} onClick={handleFinish} style={{ ...primaryButtonStyle, flex: 2, opacity: loading ? 0.5 : 1 }}>
              {loading ? <Loader2 size={16} className="spin" /> : <ArrowRight size={16} />}
              {loading ? 'Setting up…' : 'Get started'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}


function SplashScreen({ fading }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 10, background: 'var(--bg-plum)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8,
      transition: 'opacity 0.4s ease', opacity: fading ? 0 : 1, pointerEvents: fading ? 'none' : 'auto'
    }}>
      <OpusLogo size={36} />
      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, letterSpacing: 5, color: 'var(--accent-gold)' }}>OPUS</span>
      <Flourish />
      <span style={{ fontSize: 10, letterSpacing: 3, color: 'var(--accent-gold-dim)', textTransform: 'uppercase' }}>
        Your magnum opus, in progress
      </span>
    </div>
  );
}

function ExampleScreen({ profile, onExitExample }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: '24px' }}>
      <div style={{ textAlign: 'center' }}>
        <OpusLogo size={60} />
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 24,
          fontWeight: 700,
          color: 'var(--accent-gold)',
          marginBottom: 12
        }}>Welcome to Opus, Example Pitch!</h1>
        <p style={{
          fontSize: 16,
          color: 'var(--text-secondary)',
          lineHeight: 1.5,
          maxWidth: 400
        }}>
          This is your example account demonstrating how Opus works.
          In a real account, you would see your personalized data,
          quests, achievements, and progress tracking here.
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: 16,
          marginTop: 24
        }}>
          <div style={{
            textAlign: 'center',
            padding: '16px',
            background: 'var(--bg-surface)',
            borderRadius: 12,
            border: '1px solid var(--border)'
          }}>
            <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 4 }}>Sample XP</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--accent-violet)' }}>1,250 XP</div>
          </div>
          <div style={{
            textAlign: 'center',
            padding: '16px',
            background: 'var(--bg-surface)',
            borderRadius: 12,
            border: '1px solid var(--border)'
          }}>
            <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 4 }}>Level</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--accent-green)' }}>Level 5</div>
          </div>
          <div style={{
            textAlign: 'center',
            padding: '16px',
            background: 'var(--bg-surface)',
            borderRadius: 12,
            border: '1px solid var(--border)'
          }}>
            <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 4 }}>
              Streak
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--accent-amber)' }}>14 days</div>
          </div>
        </div>
        <div style={{ marginTop: 32 }}>
          <p style={{
            fontSize: 14,
            color: 'var(--text-tertiary)',
            fontStyle: 'italic'
          }}>
            Note: This is a demonstration account. Sign out to create your own personalized account.
          </p>
        </div>
        <button
          onClick={onExitExample}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            padding: '12px 24px',
            borderRadius: 12,
            border: 'none',
            background: 'var(--accent-violet)',
            color: '#fff',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            width: '100%',
            maxWidth: 200
          }}
        >
          <ArrowLeftRight size={16} /> Return to Login
        </button>
      </div>
    </div>
  );
}

function HomeScreen({ profile }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        <Pill tone="amber"><Flame size={14} /> 23 day streak</Pill>
      </div>

      <Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
          <VerificationRing percent={82} initials={profile.initials} photoUrl={profile.photoURL} />
          <div>
            <p style={{ margin: 0, fontWeight: 600, fontSize: 16 }}>{profile.name}</p>
            <p style={{ margin: '2px 0 0', fontSize: 13, color: 'var(--text-secondary)' }}>{profile.year} · Level 7</p>
          </div>
        </div>
        <LevelBar level={7} xp={3420} xpForNext={4000} />
      </Card>

      <Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <ShieldCheck size={16} color="var(--accent-green)" />
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent-green)' }}>Verification score · 82%</span>
        </div>
        <div style={{ height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={statsData} outerRadius="75%">
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis dataKey="stat" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
              <Radar dataKey="value" stroke="var(--accent-violet)" fill="var(--accent-violet)" fillOpacity={0.28} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Activity Heat Map */}
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <Flame size={16} color="var(--accent-amber)" />
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent-amber)' }}>Activity Heat Map</span>
        </div>
        <div style={{ height: 120 }}>
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 4 }}>
            <div style={{ display: 'flex', flex: 1, alignItems: 'center', gap: 2 }}>
              <div style={{ width: 20, textAlign: 'right', fontSize: 11, color: 'var(--text-secondary)' }}>Week 4</div>
              <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
                {[0, 1, 2, 3, 4, 5, 6].map(day => (
                  <div
                    key={day}
                    style={{
                      background: `var(--bg-surface-2)`,
                      borderRadius: 2,
                      height: 10
                    }}
                  />
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flex: 1, alignItems: 'center', gap: 2 }}>
              <div style={{ width: 20, textAlign: 'right', fontSize: 11, color: 'var(--text-secondary)' }}>Week 3</div>
              <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
                {[0, 1, 2, 3, 4, 5, 6].map(day => (
                  <div
                    key={day}
                    style={{
                      background: `var(--bg-surface-2)`,
                      borderRadius: 2,
                      height: 10
                    }}
                  />
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flex: 1, alignItems: 'center', gap: 2 }}>
              <div style={{ width: 20, textAlign: 'right', fontSize: 11, color: 'var(--text-secondary)' }}>Week 2</div>
              <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
                {[0, 1, 2, 3, 4, 5, 6].map(day => (
                  <div
                    key={day}
                    style={{
                      background: `var(--bg-surface-2)`,
                      borderRadius: 2,
                      height: 10
                    }}
                  />
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flex: 1, alignItems: 'center', gap: 2 }}>
              <div style={{ width: 20, textAlign: 'right', fontSize: 11, color: 'var(--text-secondary)' }}>Week 1</div>
              <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
                {[0, 1, 2, 3, 4, 5, 6].map(day => (
                  <div
                    key={day}
                    style={{
                      background: `var(--bg-surface-2)`,
                      borderRadius: 2,
                      height: 10
                    }}
                  />
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flex: 1, alignItems: 'center', gap: 2 }}>
              <div style={{ width: 20, textAlign: 'right', fontSize: 11, color: 'var(--text-secondary)' }}>This Week</div>
              <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
                {[0, 1, 2, 3, 4, 5, 6].map(day => (
                  <div
                    key={day}
                    style={{
                      background: `var(--bg-surface-2)`,
                      borderRadius: 2,
                      height: 10
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
          <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>Low</span>
          <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>High</span>
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Card style={{ background: 'var(--bg-surface-2)' }}>
          <p style={{ margin: '0 0 4px', fontSize: 12, color: 'var(--text-secondary)' }}>Study hours (wk)</p>
          <p style={{ margin: 0, fontSize: 24, fontWeight: 700, fontFamily: 'var(--font-display)' }}>11.5</p>
        </Card>
        <Card style={{ background: 'var(--bg-surface-2)' }}>
          <p style={{ margin: '0 0 4px', fontSize: 12, color: 'var(--text-secondary)' }}>Total XP</p>
          <p style={{ margin: 0, fontSize: 24, fontWeight: 700, fontFamily: 'var(--font-display)' }}>3,420</p>
        </Card>
      </div>
    </div>
  );
}

function QuestsScreen() {
  const [quests, setQuests] = useLocalStorage('opus-quests', initialQuests.map(({ icon, ...rest }) => ({ ...rest, iconId: rest.title.includes('Study') ? 'study' : rest.title.includes('training') ? 'fitness' : rest.title.includes('Read') ? 'reading' : rest.title.includes('Piano') ? 'creative' : 'volunteering' })));
  const [scanning, setScanning] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: '', iconId: 'study', xp: '', hasTarget: false, target: '30', evidenceType: '', fileName: '' });

  const done = quests.filter(q => q.status === 'done').length;

  const iconFor = id => (questIconOptions.find(o => o.id === id) || questIconOptions[0]).icon;

  const handleVerify = () => {
    if (scanning) return;
    const target = quests.find(q => q.status !== 'done');
    if (!target) return;
    setScanning(true);
    setTimeout(() => {
      setQuests(prev => prev.map(q => {
        if (q.id !== target.id) return q;
        if (q.status === 'progress') return { ...q, status: 'done', progress: q.target, detail: 'Verified' };
        return { ...q, status: 'done', detail: 'Verified' };
      }));
      setScanning(false);
    }, 1100);
  };

  const resetForm = () => setForm({ title: '', iconId: 'study', xp: '', hasTarget: false, target: '30', evidenceType: '', fileName: '' });

  const handleAddQuest = () => {
    if (!form.title.trim()) return;
    const newQuest = {
      id: Date.now(),
      title: form.title.trim(),
      iconId: form.iconId,
      status: 'todo',
      xp: parseInt(form.xp, 10) || 10,
      detail: form.evidenceType ? `Awaiting ${form.evidenceType} evidence` : 'Not started',
      ...(form.hasTarget && { progress: 0, target: parseInt(form.target, 10) || 30 }),
    };
    setQuests(prev => [...prev, newQuest]);
    resetForm();
    setShowAdd(false);
  };

  const handleFileChange = e => {
    const file = e.target.files[0];
    setForm(f => ({ ...f, fileName: file ? file.name : '' }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700 }}>Today's quests</span>
        <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{done} of {quests.length} done</span>
      </div>

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        {quests.map((q, i) => {
          const Icon = iconFor(q.iconId);
          return (
            <div key={q.id} style={{
              padding: '14px 16px',
              borderBottom: i < quests.length - 1 ? '1px solid var(--border)' : 'none'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: q.status === 'done' ? 'rgba(74,222,128,0.16)' : 'var(--bg-surface-2)'
                }}>
                  {q.status === 'done'
                    ? <Check size={16} color="var(--accent-green)" />
                    : <Icon size={16} color="var(--text-secondary)" />}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>{q.title}</p>
                  <p style={{ margin: 0, fontSize: 12, color: 'var(--text-secondary)' }}>
                    {q.status === 'progress' ? `${q.progress} / ${q.target} min` : `${q.detail} · +${q.xp} XP`}
                  </p>
                </div>
              </div>
              {q.status === 'progress' && (
                <div style={{ height: 6, background: 'var(--bg-surface-2)', borderRadius: 99, marginTop: 8, marginLeft: 46, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(q.progress / q.target) * 100}%`, background: 'var(--accent-green)' }} />
                </div>
              )}
            </div>
          );
        })}
      </Card>

      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={handleVerify} disabled={done === quests.length} style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          padding: '12px', borderRadius: 12, border: '1px solid var(--border)',
          background: 'var(--bg-surface)', color: 'var(--text-primary)', fontSize: 14, fontWeight: 600,
          cursor: done === quests.length ? 'default' : 'pointer', opacity: done === quests.length ? 0.5 : 1
        }}>
          {scanning ? <Loader2 size={16} className="spin" /> : <Camera size={16} />}
          {scanning ? 'Verifying…' : done === quests.length ? 'All quests verified' : 'Verify a quest'}
        </button>
        <button onClick={() => setShowAdd(s => !s)} style={{
          width: 48, display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: 12, border: '1px solid var(--border)',
          background: showAdd ? 'rgba(139,124,246,0.16)' : 'var(--bg-surface)',
          color: showAdd ? 'var(--accent-violet)' : 'var(--text-primary)', cursor: 'pointer'
        }} aria-label="Add a quest">
          {showAdd ? <X size={18} /> : <Plus size={18} />}
        </button>
      </div>

      {showAdd && (
        <Card>
          <p style={{ margin: '0 0 12px', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>Add a custom quest</p>

          <label style={{ fontSize: 12, color: 'var(--text-secondary)' }}>What did you do?</label>
          <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            placeholder="e.g. Practice guitar for 20 min" style={inputStyle} />

          <div style={{ marginTop: 10 }}>
            <label style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Category</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 6 }}>
              {questIconOptions.map(o => {
                const Icon = o.icon;
                const active = form.iconId === o.id;
                return (
                  <button key={o.id} onClick={() => setForm(f => ({ ...f, iconId: o.id }))} style={{
                    display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600,
                    padding: '6px 10px', borderRadius: 999,
                    border: active ? '1px solid var(--accent-violet)' : '1px solid var(--border)',
                    background: active ? 'rgba(139,124,246,0.16)' : 'var(--bg-surface-2)',
                    color: active ? 'var(--accent-violet)' : 'var(--text-secondary)', cursor: 'pointer'
                  }}><Icon size={13} /> {o.label}</button>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10 }}>
            <div>
              <label style={{ fontSize: 12, color: 'var(--text-secondary)' }}>XP reward</label>
              <input type="number" min="0" value={form.xp} onChange={e => setForm(f => ({ ...f, xp: e.target.value }))}
                placeholder="e.g. 40" style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <input type="checkbox" checked={form.hasTarget} onChange={e => setForm(f => ({ ...f, hasTarget: e.target.checked }))} />
                Has a time target
              </label>
              {form.hasTarget && (
                <input type="number" min="1" value={form.target} onChange={e => setForm(f => ({ ...f, target: e.target.value }))}
                  placeholder="minutes" style={inputStyle} />
              )}
            </div>
          </div>

          <div style={{ marginTop: 10 }}>
            <label style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Evidence type</label>
            <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
              {evidenceTypes.map(t => {
                const Icon = t.icon;
                const active = form.evidenceType === t.id;
                return (
                  <button key={t.id} onClick={() => setForm(f => ({ ...f, evidenceType: active ? '' : t.id, fileName: '' }))} style={{
                    flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                    padding: '10px', borderRadius: 10,
                    border: active ? '1px solid var(--accent-violet)' : '1px solid var(--border)',
                    background: active ? 'rgba(139,124,246,0.16)' : 'var(--bg-surface-2)',
                    color: active ? 'var(--accent-violet)' : 'var(--text-secondary)', cursor: 'pointer'
                  }}><Icon size={16} /><span style={{ fontSize: 11, fontWeight: 600 }}>{t.label}</span></button>
                );
              })}
            </div>
            {form.evidenceType && (
              <div style={{ marginTop: 8 }}>
                <label style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  padding: '10px', borderRadius: 10, border: '1px dashed var(--border)',
                  color: 'var(--text-secondary)', fontSize: 12, cursor: 'pointer'
                }}>
                  <Plus size={14} />
                  {form.fileName || `Attach ${form.evidenceType}`}
                  <input type="file" onChange={handleFileChange} style={{ display: 'none' }} />
                </label>
              </div>
            )}
          </div>

          <button onClick={handleAddQuest} disabled={!form.title.trim()} style={{ ...primaryButtonStyle, marginTop: 14, opacity: form.title.trim() ? 1 : 0.5 }}>
            Add quest
          </button>
        </Card>
      )}
    </div>
  );
}

function ProfileScreen({ profile }) {
  const experience = [
    { icon: Microscope, title: 'Science research club — lead', detail: '8 months · 64 sessions logged' },
    { icon: HeartHandshake, title: 'Animal shelter volunteer', detail: '42 hours · supervisor sign-off' },
    { icon: Footprints, title: 'Cross country squad', detail: '2 years · 11.5 hrs / week avg' },
  ];

  const goalInfo = goalOptions.find(g => g.id === profile.goal) || goalOptions[0];
  const headline = profile.goal === 'other' && profile.customGoal ? profile.customGoal : goalInfo.headline;
  const photoUrl = profile.photoURL;

  const [heatmapViewType, setHeatmapViewType] = useState('weekly'); // weekly, monthly, yearly
  const [showGraph, setShowGraph] = useState(false); // false = heatmap, true = graph

  const getGraphData = () => {
    // Generate mock data based on view type
    if (heatmapViewType === 'weekly') {
      // Last 4 weeks + current week
      return [
        { name: 'Week 4', value: Math.floor(Math.random() * 100) },
        { name: 'Week 3', value: Math.floor(Math.random() * 100) },
        { name: 'Week 2', value: Math.floor(Math.random() * 100) },
        { name: 'Week 1', value: Math.floor(Math.random() * 100) },
        { name: 'This Week', value: Math.floor(Math.random() * 100) }
      ];
    } else if (heatmapViewType === 'monthly') {
      // Last 6 months including current
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const currentMonth = new Date().getMonth();
      const data = [];
      for (let i = 5; i >= 0; i--) {
        const monthIndex = (currentMonth - i + 12) % 12;
        data.push({
          name: monthNames[monthIndex],
          value: Math.floor(Math.random() * 100)
        });
      }
      return data;
    } else {
      // yearly - last 12 months
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return monthNames.map((month, index) => ({
        name: month,
        value: Math.floor(Math.random() * 100)
      }));
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, overflowY: 'auto', maxHeight: '100vh' }}>
      <div style={{ display: 'flex', gap: 14 }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%', flexShrink: 0, overflow: 'hidden',
          background: 'var(--accent-violet)', color: '#fff', display: 'flex',
          alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 18,
          fontFamily: 'var(--font-display)'
        }}>
          {photoUrl
            ? <img src={photoUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : profile.initials}
        </div>
        <div>
          <p style={{ margin: 0, fontWeight: 700, fontSize: 17 }}>{profile.name}</p>
          <p style={{ margin: '2px 0 0', fontSize: 13, color: 'var(--text-secondary)' }}>
            {profile.accountType === 'business'
              ? `${profile.organization || 'Organisation'} · ${profile.role || 'Team member'}`
              : `${profile.year} student · ${headline}`}
          </p>
          <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <MapPin size={12} /> {profile.school || 'Sydney, NSW'}
          </p>
        </div>
      </div>

      {/* Account-specific information */}
      <div style={{ marginTop: 16 }}>
        {profile.accountType === 'student' ? (
          <div>
            <p style={{ margin: '0 0 4px', fontSize: 12, color: 'var(--text-secondary)' }}>School/Institution</p>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>{profile.school || 'Not specified'}</p>
            <p style={{ margin: '8px 0 4px', fontSize: 12, color: 'var(--text-secondary)' }}>Year Level</p>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>{profile.year}</p>
            <p style={{ margin: '8px 0 4px', fontSize: 12, color: 'var(--text-secondary)' }}>Focus Area</p>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>{goalInfo.label}</p>
          </div>
        ) : (
          <div>
            <p style={{ margin: '0 0 4px', fontSize: 12, color: 'var(--text-secondary)' }}>Organization/Company</p>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>{profile.organization || 'Not specified'}</p>
            <p style={{ margin: '8px 0 4px', fontSize: 12, color: 'var(--text-secondary)' }}>Role</p>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>{profile.role || 'Not specified'}</p>
            <p style={{ margin: '8px 0 4px', fontSize: 12, color: 'var(--text-secondary)' }}>Industry</p>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>{profile.industry || 'Not specified'}</p>
            <p style={{ margin: '8px 0 4px', fontSize: 12, color: 'var(--text-secondary)' }}>Experience</p>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>{profile.experience || 'Not specified'}</p>
          </div>
        )}
      </div>

      <Card style={{ background: 'rgba(74,222,128,0.10)', border: '1px solid rgba(74,222,128,0.25)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ShieldCheck size={16} color="var(--accent-green)" />
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent-green)' }}>82% of activity verified</span>
        </div>
      </Card>

      {/* Activity View Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div>
          <p style={{ margin: '0 0 4px', fontSize: 12, color: 'var(--text-secondary)' }}>View Type</p>
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              onClick={() => setHeatmapViewType('weekly')}
              style={{
                flex: 1,
                padding: '6px 10px',
                borderRadius: 6,
                border: heatmapViewType === 'weekly' ? '1px solid var(--accent-violet)' : '1px solid var(--border)',
                background: heatmapViewType === 'weekly' ? 'rgba(139,124,246,0.16)' : 'var(--bg-surface)',
                color: heatmapViewType === 'weekly' ? 'var(--accent-violet)' : 'var(--text-primary)',
                fontSize: 11,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Weekly
            </button>
            <button
              onClick={() => setHeatmapViewType('monthly')}
              style={{
                flex: 1,
                padding: '6px 10px',
                borderRadius: 6,
                border: heatmapViewType === 'monthly' ? '1px solid var(--accent-violet)' : '1px solid var(--border)',
                background: heatmapViewType === 'monthly' ? 'rgba(139,124,246,0.16)' : 'var(--bg-surface)',
                color: heatmapViewType === 'monthly' ? 'var(--accent-violet)' : 'var(--text-primary)',
                fontSize: 11,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Monthly
            </button>
            <button
              onClick={() => setHeatmapViewType('yearly')}
              style={{
                flex: 1,
                padding: '6px 10px',
                borderRadius: 6,
                border: heatmapViewType === 'yearly' ? '1px solid var(--accent-violet)' : '1px solid var(--border)',
                background: heatmapViewType === 'yearly' ? 'rgba(139,124,246,0.16)' : 'var(--bg-surface)',
                color: heatmapViewType === 'yearly' ? 'var(--accent-violet)' : 'var(--text-primary)',
                fontSize: 11,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Yearly
            </button>
          </div>
        </div>
        <div>
          <button
            onClick={() => setShowGraph(!showGraph)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 10px',
              borderRadius: 6,
              border: '1px solid var(--border)',
              background: 'var(--bg-surface)',
              color: 'var(--text-primary)',
              fontSize: 11,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {showGraph ? <BarChart3 size={16} /> : <Flame size={16} color="var(--accent-amber)" />}
            <span>{showGraph ? 'Graph View' : 'Heatmap View'}</span>
          </button>
        </div>
      </div>

      {/* Activity Visualization */}
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          {showGraph ? <BarChart3 size={16} /> : <Flame size={16} color="var(--accent-amber)" />}
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent-amber)' }}>
            {showGraph ? 'Activity Graph' : 'Activity Heat Map'}
          </span>
        </div>

        {showGraph ? (
          <div style={{ height: 140 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={getGraphData()}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--text-secondary)' }} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--text-secondary)' }} domain={[0, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="var(--accent-violet)" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div style={{ height: 120 }}>
            {heatmapViewType === 'weekly' && (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 4 }}>
                <div style={{ display: 'flex', flex: 1, alignItems: 'center', gap: 2 }}>
                  <div style={{ width: 20, textAlign: 'right', fontSize: 11, color: 'var(--text-secondary)' }}>Week 4</div>
                  <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
                    {[0, 1, 2, 3, 4, 5, 6].map((day, index) => {
                      // Simulate activity data - in a real app, this would come from actual logs
                      const activityLevel = Math.floor(Math.random() * 4); // 0-3
                      const bgColor = activityLevel === 0 ? 'var(--bg-surface-2)' :
                                    activityLevel === 1 ? 'rgba(139,124,246,0.2)' :
                                    activityLevel === 2 ? 'rgba(139,124,246,0.4)' :
                                    'var(--accent-violet)';
                      return (
                        <div
                          key={day}
                          style={{
                            background: bgColor,
                            borderRadius: 2,
                            height: 10
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
                <div style={{ display: 'flex', flex: 1, alignItems: 'center', gap: 2 }}>
                  <div style={{ width: 20, textAlign: 'right', fontSize: 11, color: 'var(--text-secondary)' }}>Week 3</div>
                  <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
                    {[0, 1, 2, 3, 4, 5, 6].map((day, index) => {
                      // Simulate activity data - in a real app, this would come from actual logs
                      const activityLevel = Math.floor(Math.random() * 4); // 0-3
                      const bgColor = activityLevel === 0 ? 'var(--bg-surface-2)' :
                                    activityLevel === 1 ? 'rgba(139,124,246,0.2)' :
                                    activityLevel === 2 ? 'rgba(139,124,246,0.4)' :
                                    'var(--accent-violet)';
                      return (
                        <div
                          key={day}
                          style={{
                            background: bgColor,
                            borderRadius: 2,
                            height: 10
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
                <div style={{ display: 'flex', flex: 1, alignItems: 'center', gap: 2 }}>
                  <div style={{ width: 20, textAlign: 'right', fontSize: 11, color: 'var(--text-secondary)' }}>Week 2</div>
                  <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
                    {[0, 1, 2, 3, 4, 5, 6].map((day, index) => {
                      // Simulate activity data - in a real app, this would come from actual logs
                      const activityLevel = Math.floor(Math.random() * 4); // 0-3
                      const bgColor = activityLevel === 0 ? 'var(--bg-surface-2)' :
                                    activityLevel === 1 ? 'rgba(139,124,246,0.2)' :
                                    activityLevel === 2 ? 'rgba(139,124,246,0.4)' :
                                    'var(--accent-violet)';
                      return (
                        <div
                          key={day}
                          style={{
                            background: bgColor,
                            borderRadius: 2,
                            height: 10
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
                <div style={{ display: 'flex', flex: 1, alignItems: 'center', gap: 2 }}>
                  <div style={{ width: 20, textAlign: 'right', fontSize: 11, color: 'var(--text-secondary)' }}>Week 1</div>
                  <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
                    {[0, 1, 2, 3, 4, 5, 6].map((day, index) => {
                      // Simulate activity data - in a real app, this would come from actual logs
                      const activityLevel = Math.floor(Math.random() * 4); // 0-3
                      const bgColor = activityLevel === 0 ? 'var(--bg-surface-2)' :
                                    activityLevel === 1 ? 'rgba(139,124,246,0.2)' :
                                    activityLevel === 2 ? 'rgba(139,124,246,0.4)' :
                                    'var(--accent-violet)';
                      return (
                        <div
                          key={day}
                          style={{
                            background: bgColor,
                            borderRadius: 2,
                            height: 10
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
                <div style={{ display: 'flex', flex: 1, alignItems: 'center', gap: 2 }}>
                  <div style={{ width: 20, textAlign: 'right', fontSize: 11, color: 'var(--text-secondary)' }}>This Week</div>
                  <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
                    {[0, 1, 2, 3, 4, 5, 6].map((day, index) => {
                      // Simulate activity data - in a real app, this would come from actual logs
                      const activityLevel = Math.floor(Math.random() * 4); // 0-3
                      const bgColor = activityLevel === 0 ? 'var(--bg-surface-2)' :
                                    activityLevel === 1 ? 'rgba(139,124,246,0.2)' :
                                    activityLevel === 2 ? 'rgba(139,124,246,0.4)' :
                                    'var(--accent-violet)';
                      return (
                        <div
                          key={day}
                          style={{
                            background: bgColor,
                            borderRadius: 2,
                            height: 10
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {heatmapViewType === 'monthly' && (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ width: 60, textAlign: 'right', fontSize: 11, color: 'var(--text-secondary)' }}>Month</div>
                  <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
                    {/* Show 5 weeks (35 days) to represent a month */}
                    {Array.from({ length: 35 }, (_, i) => {
                      const weekIndex = Math.floor(i / 7);
                      const dayIndex = i % 7;
                      const activityLevel = Math.floor(Math.random() * 4); // 0-3
                      const bgColor = activityLevel === 0 ? 'var(--bg-surface-2)' :
                                    activityLevel === 1 ? 'rgba(139,124,246,0.2)' :
                                    activityLevel === 2 ? 'rgba(139,124,246,0.4)' :
                                    'var(--accent-violet)';
                      return (
                        <div
                          key={i}
                          style={{
                            background: bgColor,
                            borderRadius: 2,
                            height: 10
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
                {/* Show week labels */}
                <div style={{ display: 'flex', flex: 1, alignItems: 'center', gap: 2 }}>
                  <div style={{ width: 60, textAlign: 'right', fontSize: 11, color: 'var(--text-secondary)' }}>Week 1</div>
                  <div style={{ width: 60, textAlign: 'right', fontSize: 11, color: 'var(--text-secondary)' }}>Week 2</div>
                  <div style={{ width: 60, textAlign: 'right', fontSize: 11, color: 'var(--text-secondary)' }}>Week 3</div>
                  <div style={{ width: 60, textAlign: 'right', fontSize: 11, color: 'var(--text-secondary)' }}>Week 4</div>
                  <div style={{ width: 60, textAlign: 'right', fontSize: 11, color: 'var(--text-secondary)' }}>Week 5</div>
                </div>
              </div>
            )}

            {heatmapViewType === 'yearly' && (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ width: 60, textAlign: 'right', fontSize: 11, color: 'var(--text-secondary)' }}>Month</div>
                  <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
                    {/* Show 12 months in 3 rows of 4 */}
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, index) => {
                      const activityLevel = Math.floor(Math.random() * 4); // 0-3
                      const bgColor = activityLevel === 0 ? 'var(--bg-surface-2)' :
                                    activityLevel === 1 ? 'rgba(139,124,246,0.2)' :
                                    activityLevel === 2 ? 'rgba(139,124,246,0.4)' :
                                    'var(--accent-violet)';
                      return (
                        <div
                          key={index}
                          style={{
                            background: bgColor,
                            borderRadius: 2,
                            height: 10
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
                {/* Show month labels for reference */}
                <div style={{ display: 'flex', flex: 1, flexDirection: 'column', justifyContent: 'space-around' }}>
                  <div>
                    <div style={{ width: 60, textAlign: 'right', fontSize: 10, color: 'var(--text-secondary)' }}>Jan</div>
                    <div style={{ width: 60, textAlign: 'right', fontSize: 10, color: 'var(--text-secondary)' }}>Feb</div>
                    <div style={{ width: 60, textAlign: 'right', fontSize: 10, color: 'var(--text-secondary)' }}>Mar</div>
                    <div style={{ width: 60, textAlign: 'right', fontSize: 10, color: 'var(--text-secondary)' }}>Apr</div>
                  </div>
                  <div>
                    <div style={{ width: 60, textAlign: 'right', fontSize: 10, color: 'var(--text-secondary)' }}>May</div>
                    <div style={{ width: 60, textAlign: 'right', fontSize: 10, color: 'var(--text-secondary)' }}>Jun</div>
                    <div style={{ width: 60, textAlign: 'right', fontSize: 10, color: 'var(--text-secondary)' }}>Jul</div>
                    <div style={{ width: 60, textAlign: 'right', fontSize: 10, color: 'var(--text-secondary)' }}>Aug</div>
                  </div>
                  <div>
                    <div style={{ width: 60, textAlign: 'right', fontSize: 10, color: 'var(--text-secondary)' }}>Sep</div>
                    <div style={{ width: 60, textAlign: 'right', fontSize: 10, color: 'var(--text-secondary)' }}>Oct</div>
                    <div style={{ width: 60, textAlign: 'right', fontSize: 10, color: 'var(--text-secondary)' }}>Nov</div>
                    <div style={{ width: 60, textAlign: 'right', fontSize: 10, color: 'var(--text-secondary)' }}>Dec</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
          <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>Low</span>
          <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>High</span>
        </div>
      </Card>

      <div>
        <p style={{ margin: '0 0 8px', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>Strengths</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {['Consistency', 'Team coordination', 'Research & analysis', 'Time management'].map(s => (
            <Pill key={s} tone="blue">{s}</Pill>
          ))}
        </div>
      </div>

      <div>
        <p style={{ margin: '0 0 8px', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>Badges</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {achievements.map(a => {
            const Icon = a.icon;
            return (
              <div key={a.id} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                padding: '12px 6px', borderRadius: 12, border: '1px solid var(--border)',
                background: a.unlocked ? 'rgba(242,217,165,0.08)' : 'var(--bg-surface)',
                opacity: a.unlocked ? 1 : 0.4
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  background: a.unlocked ? 'rgba(242,217,165,0.16)' : 'var(--bg-surface-2)'
                }}>
                  <Icon size={17} color={a.unlocked ? 'var(--accent-gold)' : 'var(--text-tertiary)'} />
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, textAlign: 'center', lineHeight: 1.3 }}>{a.title}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <p style={{ margin: '0 0 8px', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>Verified experience</p>
        <Card style={{ padding: 0 }}>
          {experience.map((e, i) => {
            const Icon = e.icon;
            return (
              <div key={e.title} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
                borderBottom: i < experience.length - 1 ? '1px solid var(--border)' : 'none'
              }}>
                <Icon size={18} color="var(--text-primary)" />
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>{e.title}</p>
                  <p style={{ margin: 0, fontSize: 12, color: 'var(--text-secondary)' }}>{e.detail}</p>
                </div>
                <Check size={16} color="var(--accent-green)" />
              </div>
            );
          })}
        </Card>
      </div>

      <div>
        <p style={{ margin: '0 0 8px', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>Send profile</p>
        <Card style={{ padding: 0 }}>
          {sends.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={s.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                padding: '12px 16px', borderBottom: i < sends.length - 1 ? '1px solid var(--border)' : 'none',
                opacity: s.locked ? 0.5 : 1
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Icon size={18} color="var(--text-primary)" />
                  <div>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>{s.title}</p>
                    <p style={{ margin: 0, fontSize: 12, color: s.locked ? 'var(--text-secondary)' : 'var(--accent-green)' }}>
                      {s.locked ? s.reason : 'Unlocked'}
                    </p>
                  </div>
                </div>
                {s.locked
                  ? <Lock size={16} color="var(--text-secondary)" />
                  : <button style={{
                      fontSize: 12, fontWeight: 600, padding: '6px 12px', borderRadius: 8,
                      border: '1px solid var(--border)', background: 'var(--bg-surface-2)',
                      color: 'var(--text-primary)', cursor: 'pointer'
                    }}>Send</button>}
              </div>
            );
          })}
        </Card>
      </div>

      <button style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        padding: '12px', borderRadius: 12, border: '1px solid var(--border)',
        background: 'var(--bg-surface)', color: 'var(--text-primary)', fontSize: 14, fontWeight: 600, cursor: 'pointer'
      }}>
        <Share2 size={16} /> Share profile
      </button>
    </div>
  );
}

function JobsScreen() {
  const [filter, setFilter] = useState('Work experience');
  const filters = ['All', 'Work experience', 'Part-time', 'Volunteering'];
  const matchTone = m => (m >= 90 ? 'green' : 'blue');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700 }}>Opportunities</span>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            fontSize: 12, fontWeight: 600, padding: '6px 12px', borderRadius: 999,
            border: f === filter ? '1px solid var(--accent-violet)' : '1px solid var(--border)',
            background: f === filter ? 'rgba(139,124,246,0.16)' : 'var(--bg-surface)',
            color: f === filter ? 'var(--accent-violet)' : 'var(--text-secondary)',
            cursor: 'pointer'
          }}>{f}</button>
        ))}
      </div>

      {opportunities.map(o => {
        const Icon = o.icon;
        return (
          <Card key={o.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10, gap: 8 }}>
              <div style={{ display: 'flex', gap: 10 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10, background: 'var(--bg-surface-2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}><Icon size={18} color="var(--text-primary)" /></div>
                <div>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>{o.title}</p>
                  <p style={{ margin: 0, fontSize: 12, color: 'var(--text-secondary)' }}>{o.org}</p>
                </div>
              </div>
              <Pill tone={matchTone(o.match)}>{o.match}% match</Pill>
            </div>
            <p style={{ margin: '0 0 10px', fontSize: 12, color: 'var(--text-secondary)' }}>{o.detail}</p>
            <button style={{
              width: '100%', padding: '10px', borderRadius: 10, border: '1px solid var(--border)',
              background: 'var(--bg-surface-2)', color: 'var(--text-primary)', fontSize: 13, fontWeight: 600, cursor: 'pointer'
            }}>Apply with profile</button>
          </Card>
        );
      })}
    </div>
  );
}

function EmployerScreen({ profile }) {
  const matchTone = m => (m >= 90 ? 'green' : 'blue');
  const initialStatuses = Object.fromEntries(applicants.map(a => [a.id, a.match >= 90 ? 'accepted' : 'pending']));
  const [statuses, setStatuses] = useState(initialStatuses);
  const [filter, setFilter] = useState('all');
  const [messaged, setMessaged] = useState({});

  const filters = ['all', 'pending', 'accepted', 'rejected'];
  const visible = applicants.filter(a => filter === 'all' || statuses[a.id] === filter);

  const setStatus = (id, status) => setStatuses(prev => ({ ...prev, [id]: status }));
  const toggleMessaged = id => setMessaged(prev => ({ ...prev, [id]: !prev[id] }));

  const statusTone = status => ({
    pending: 'amber', accepted: 'green', rejected: 'neutral'
  }[status]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <p style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700 }}>Northside Vet Clinic</p>
        <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--text-secondary)' }}>Vet assistant — work experience</p>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            fontSize: 12, fontWeight: 600, padding: '6px 12px', borderRadius: 999, textTransform: 'capitalize',
            border: f === filter ? '1px solid var(--accent-violet)' : '1px solid var(--border)',
            background: f === filter ? 'rgba(139,124,246,0.16)' : 'var(--bg-surface)',
            color: f === filter ? 'var(--accent-violet)' : 'var(--text-secondary)',
            cursor: 'pointer'
          }}>{f} {f !== 'all' && `(${applicants.filter(a => statuses[a.id] === f).length})`}</button>
        ))}
      </div>

      <Card style={{ padding: 0 }}>
        {visible.length === 0 && (
          <p style={{ margin: 0, padding: 16, fontSize: 13, color: 'var(--text-secondary)' }}>No applicants in this category.</p>
        )}
        {visible.map((a, i) => {
          const status = statuses[a.id];
          return (
            <div key={a.id} style={{
              padding: '14px 16px',
              borderBottom: i < visible.length - 1 ? '1px solid var(--border)' : 'none'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%', background: 'var(--accent-violet)',
                    color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: 13, fontFamily: 'var(--font-display)'
                  }}>{a.initials}</div>
                  <div>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>{a.name}</p>
                    <p style={{ margin: 0, fontSize: 12, color: 'var(--text-secondary)' }}>{a.strengths}</p>
                  </div>
                </div>
                <Pill tone={matchTone(a.match)}>{a.match}% match</Pill>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                <Pill tone={statusTone(status)}>{status}</Pill>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => toggleMessaged(a.id)} style={{
                    ...secondaryButtonStyle,
                    color: messaged[a.id] ? 'var(--accent-blue)' : 'var(--text-primary)',
                    background: messaged[a.id] ? 'rgba(95,168,232,0.14)' : 'var(--bg-surface-2)'
                  }}>
                    <MessageSquare size={13} /> {messaged[a.id] ? 'Sent' : 'Message'}
                  </button>
                  {status !== 'accepted' && (
                    <button onClick={() => setStatus(a.id, 'accepted')} style={{
                      ...secondaryButtonStyle, color: 'var(--accent-green)', background: 'rgba(74,222,128,0.14)'
                    }}>
                      <UserCheck size={13} /> Accept
                    </button>
                  )}
                  {status !== 'rejected' && (
                    <button onClick={() => setStatus(a.id, 'rejected')} style={{
                      ...secondaryButtonStyle, color: 'var(--text-secondary)'
                    }}>
                      <UserX size={13} /> Reject
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </Card>

      <Card style={{ background: 'var(--bg-surface-2)' }}>
        <p style={{ margin: 0, fontSize: 12, color: 'var(--text-secondary)', display: 'flex', alignItems: 'flex-start', gap: 6 }}>
          <ShieldCheck size={14} style={{ flexShrink: 0, marginTop: 1 }} />
          Match scores are based on verified activity, not self-reported claims.
        </p>
      </Card>
      <div style={{ marginTop: 20 }}>
        <button onClick={async () => {
          const success = await GoogleSheetsService.sendProfileData(profile);
          if (success) {
            alert('Profile data exported to Google Sheets successfully!');
          } else {
            alert('Failed to export profile data. Please check configuration.');
          }
        }} style={{ ...primaryButtonStyle, marginTop: 14 }}>
          Export to Google Sheets
        </button>
      </div>

    </div>
  );
}

function LeaderboardScreen({ profile }) {
  const [view, setView] = useState('friends');
  const [friends, setFriends] = useState(
    Object.fromEntries(leaderboardUsers.map(u => [u.id, u.isFriend]))
  );

  const allUsers = [
    ...leaderboardUsers,
    { id: 'me', name: profile.name, initials: profile.initials, level: 7, coins: 3420, isFriend: false, isMe: true },
  ];

  const visible = allUsers
    .filter(u => view === 'global' || u.isMe || friends[u.id])
    .sort((a, b) => b.coins - a.coins);

  const toggleFriend = id => setFriends(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700 }}>Leaderboard</span>

      <div style={{ display: 'flex', gap: 8 }}>
        {['friends', 'global'].map(v => (
          <button key={v} onClick={() => setView(v)} style={{
            fontSize: 12, fontWeight: 600, padding: '6px 12px', borderRadius: 999,
            border: v === view ? '1px solid var(--accent-violet)' : '1px solid var(--border)',
            background: v === view ? 'rgba(139,124,246,0.16)' : 'var(--bg-surface)',
            color: v === view ? 'var(--accent-violet)' : 'var(--text-secondary)',
            cursor: 'pointer', textTransform: 'capitalize'
          }}>{v}</button>
        ))}
      </div>

      <Card style={{ padding: 0 }}>
        {visible.map((u, i) => (
          <div key={u.id} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
            padding: '12px 16px', borderBottom: i < visible.length - 1 ? '1px solid var(--border)' : 'none',
            background: u.isMe ? 'rgba(139,124,246,0.08)' : 'transparent'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{
                width: 20, fontSize: 13, fontWeight: 700, color: i < 3 ? 'var(--accent-amber)' : 'var(--text-tertiary)',
                fontFamily: 'var(--font-display)', textAlign: 'center'
              }}>
                {i === 0 ? <Crown size={15} /> : i + 1}
              </span>
              <div style={{
                width: 34, height: 34, borderRadius: '50%', background: 'var(--accent-violet)',
                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: 12, fontFamily: 'var(--font-display)', flexShrink: 0
              }}>{u.initials}</div>
              <div>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>{u.name}{u.isMe ? ' (you)' : ''}</p>
                <p style={{ margin: 0, fontSize: 12, color: 'var(--text-secondary)' }}>Level {u.level}</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 700, color: 'var(--accent-amber)' }}>
                <Coins size={14} /> {u.coins.toLocaleString()}
              </span>
              {!u.isMe && (
                <button onClick={() => toggleFriend(u.id)} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: 28, height: 28, borderRadius: '50%', border: '1px solid var(--border)',
                  background: friends[u.id] ? 'rgba(74,222,128,0.14)' : 'var(--bg-surface-2)',
                  color: friends[u.id] ? 'var(--accent-green)' : 'var(--text-secondary)', cursor: 'pointer'
                }} aria-label={friends[u.id] ? 'Remove friend' : 'Add friend'}>
                  {friends[u.id] ? <Check size={14} /> : <UserPlus size={14} />}
                </button>
              )}
            </div>
          </div>
        ))}
      </Card>

      <Card style={{ background: 'var(--bg-surface-2)' }}>
        <p style={{ margin: 0, fontSize: 12, color: 'var(--text-secondary)' }}>
          Opus Coins are earned from verified quests and unlock cosmetic rewards and competition entries.
        </p>
      </Card>
    </div>
  );
}


const tabs = [
  { id: 'home', label: 'Home', icon: Home, component: HomeScreen },
  { id: 'quests', label: 'Quests', icon: ListChecks, component: QuestsScreen },
  { id: 'leaderboard', label: 'Ranks', icon: Trophy, component: LeaderboardScreen },
  { id: 'profile', label: 'Profile', icon: User, component: ProfileScreen },
  { id: 'jobs', label: 'Jobs', icon: Briefcase, component: JobsScreen },
];

export default function App() {
  const [tab, setTab] = useState('home');
  const [mode, setMode] = useState('student');
  const [showSplash, setShowSplash] = useState(true);
  const [splashFading, setSplashFading] = useState(false);
  const [profile, setProfile] = useLocalStorage('opus-profile', null);
  const ActiveScreen = tabs.find(t => t.id === tab).component;

  useEffect(() => {
    const completeEmailLinkSignIn = async () => {
      if (!firebaseEnabled) return;

      try {
        const { isSignInWithEmailLink, signInWithEmailLink, doc, getDoc, setDoc, db } = await import('./firebase.js');

        if (!isSignInWithEmailLink(auth, window.location.href)) return;

        let emailForSignIn = window.localStorage.getItem('emailForSignIn');

        if (!emailForSignIn) {
          emailForSignIn = window.prompt('Please confirm your email address');
        }

        if (!emailForSignIn) return;

        const result = await signInWithEmailLink(auth, emailForSignIn, window.location.href);
        window.localStorage.removeItem('emailForSignIn');

        const userRef = doc(db, 'users', result.user.uid);
        const snap = await getDoc(userRef);

        if (snap.exists()) {
          setProfile(snap.data());
        } else {
          const pendingProfile = JSON.parse(window.localStorage.getItem('pendingOpusProfile') || '{}');
          window.localStorage.removeItem('pendingOpusProfile');

          const derivedInitials = result.user.displayName
            ? result.user.displayName.split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase()
            : (pendingProfile.initials || '?');

          const profileData = {
            ...pendingProfile,
            uid: result.user.uid,
            name: pendingProfile.name || result.user.displayName || (result.user.email ? result.user.email.split('@')[0] : 'New user'),
            initials: derivedInitials,
            email: result.user.email || emailForSignIn,
            photoURL: result.user.photoURL || null,
            needsOnboarding: true,
          };

          await setDoc(userRef, profileData);
          setProfile(profileData);
        }

        window.history.replaceState({}, document.title, window.location.origin);
      } catch (err) {
        console.error('Failed to complete email link sign-in:', err);
      }
    };

    completeEmailLinkSignIn();
  }, [setProfile]);

  useEffect(() => {
    if (profile && !profile.isExample) {
      GoogleSheetsService.sendProfileData(profile).then(success => {
        if (success) {
          console.log('Profile data synced to Google Sheets');
        } else {
          console.warn('Failed to sync profile data to Google Sheets');
        }
      });
    }
  }, [profile]);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setSplashFading(true), 1300);
    const removeTimer = setTimeout(() => setShowSplash(false), 1700);
    return () => { clearTimeout(fadeTimer); clearTimeout(removeTimer); };
  }, []);

  const handleSignOut = async () => {
    if (firebaseEnabled && auth?.currentUser) {
      try { await signOut(auth); } catch { /* ignore */ }
    }
    setProfile(null);
  };

  return (
    <div style={{
      '--bg-base': '#1C1B19',
      '--bg-surface': '#252320',
      '--bg-surface-2': '#2F2C28',
      '--border': '#3A372F',
      '--text-primary': '#F7F4EF',
      '--text-secondary': '#A8A39A',
      '--text-tertiary': '#6F6B63',
      '--accent-violet': '#8B7CF6',
      '--accent-green': '#4ADE80',
      '--accent-amber': '#F5A93C',
      '--accent-blue': '#5FA8E8',
      '--bg-plum': '#2B1E2C',
      '--accent-gold': '#F2D9A5',
      '--accent-gold-dim': '#9C8B6E',
      '--font-display': "'Space Grotesk', sans-serif",
      '--font-body': "'Inter', sans-serif",
      display: 'flex', justifyContent: 'center', padding: '24px 12px',
      fontFamily: 'var(--font-body)', color: 'var(--text-primary)'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700&family=Inter:wght@400;500;600;700&display=swap');
        .spin { animation: opus-spin 1s linear infinite; }
        @keyframes opus-spin { to { transform: rotate(360deg); } }
        button { font-family: var(--font-body); }
        input[type="checkbox"] { accent-color: var(--accent-violet); }
      `}</style>

      <div style={{
        position: 'relative', width: '100%', maxWidth: 400, background: 'var(--bg-base)',
        border: '1px solid var(--border)', borderRadius: 28, overflow: 'hidden',
        display: 'flex', flexDirection: 'column', minHeight: 760
      }}>
        {showSplash && <SplashScreen fading={splashFading} />}

        {!profile ? (
          <div style={{ flex: 1, padding: '8px 16px 16px', overflowY: 'auto' }}>
            <AuthScreen onComplete={setProfile} />
          </div>
        ) : profile.isExample ? (
          <ExampleScreen profile={profile} onExitExample={handleSignOut} />
        ) : (
          <>
            <div style={{ padding: '20px 16px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button onClick={handleSignOut} style={{
                display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600,
                padding: '6px 12px', borderRadius: 999, border: '1px solid var(--border)',
                background: 'var(--bg-surface)', color: 'var(--text-secondary)', cursor: 'pointer'
              }}>
                <User size={13} /> Sign out
              </button>
              {profile.isExample && (
                <button onClick={() => setMode(mode === 'student' ? 'employer' : 'student')} style={{
                  display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600,
                  padding: '6px 12px', borderRadius: 999, border: '1px solid var(--border)',
                  background: 'var(--bg-surface)', color: 'var(--text-secondary)', cursor: 'pointer'
                }}>
                  <ArrowLeftRight size={13} />
                  {mode === 'student' ? 'Employer view' : 'Student view'}
                </button>
              )}
            </div>

            <div style={{ flex: 1, padding: '8px 16px 16px', overflowY: 'auto' }}>
              {mode === 'employer' || profile.accountType === 'business'
                ? <EmployerScreen profile={profile} />
                : <ActiveScreen profile={profile} />}
            </div>

            {mode === 'student' && profile.accountType !== 'business' && (
              <div style={{ display: 'flex', borderTop: '1px solid var(--border)', padding: '8px 8px' }}>
                {tabs.map(t => {
                  const Icon = t.icon;
                  const active = t.id === tab;
                  return (
                    <button key={t.id} onClick={() => setTab(t.id)} style={{
                      flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                      padding: '8px 0', border: 'none', background: 'transparent',
                      color: active ? 'var(--accent-violet)' : 'var(--text-tertiary)', cursor: 'pointer'
                    }}>
                      <Icon size={20} />
                      <span style={{ fontSize: 11, fontWeight: 600 }}>{t.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
