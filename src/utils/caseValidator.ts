export interface ValidationResult {
  score: number;
  maxScore: number;
  feedback: string[];
  objectives: Array<{
    id: string;
    title: string;
    description: string;
    completed: boolean;
    partial: boolean;
    points: number;
  }>;
}

export const validateCase = (
  caseId: string,
  html: string,
  css: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _targetHtml: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _targetCss: string
): ValidationResult => {
  switch (caseId) {
    case 'case-1':
      return validateCase1(html, css);
    case 'case-2':
      return validateCase2(html, css);
    default:
      return {
        score: 0,
        maxScore: 100,
        feedback: ['Unknown case'],
        objectives: []
      };
  }
};

const validateCase1 = (html: string, css: string): ValidationResult => {
  const objectives = [
    {
      id: 'header-tag',
      title: 'Use proper header tag',
      description: 'Wrap header content in <header> tag',
      completed: false,
      partial: false,
      points: 25
    },
    {
      id: 'nav-tag',
      title: 'Add navigation structure',
      description: 'Use <nav> tag for navigation links',
      completed: false,
      partial: false,
      points: 25
    },
    {
      id: 'flexbox-layout',
      title: 'Implement flexbox layout',
      description: 'Use display: flex for header layout',
      completed: false,
      partial: false,
      points: 25
    },
    {
      id: 'styling',
      title: 'Add visual styling',
      description: 'Apply colors, spacing, and hover effects',
      completed: false,
      partial: false,
      points: 25
    }
  ];

  const feedback: string[] = [];
  let totalScore = 0;

  // Check for header tag
  if (html.includes('<header')) {
    objectives[0].completed = true;
    totalScore += objectives[0].points;
    feedback.push('✅ Excellent! You used the semantic <header> tag.');
  } else if (html.includes('header')) {
    objectives[0].partial = true;
    totalScore += Math.floor(objectives[0].points / 2);
    feedback.push('⚠️ Good start! Try using the <header> tag for better semantic HTML.');
  } else {
    feedback.push('❌ Missing header structure. Use <header> tag to wrap header content.');
  }

  // Check for nav tag
  if (html.includes('<nav')) {
    objectives[1].completed = true;
    totalScore += objectives[1].points;
    feedback.push('✅ Perfect! Navigation is properly structured with <nav> tag.');
  } else if (html.includes('navigation')) {
    objectives[1].partial = true;
    totalScore += Math.floor(objectives[1].points / 2);
    feedback.push('⚠️ Navigation exists but could use proper <nav> tag.');
  } else {
    feedback.push('❌ Navigation structure needs improvement.');
  }

  // Check for flexbox
  if (css.includes('display: flex') || css.includes('display:flex')) {
    objectives[2].completed = true;
    totalScore += objectives[2].points;
    feedback.push('✅ Great use of flexbox for layout!');
  } else if (css.includes('flex')) {
    objectives[2].partial = true;
    totalScore += Math.floor(objectives[2].points / 2);
    feedback.push('⚠️ Flexbox detected but not fully implemented.');
  } else {
    feedback.push('❌ Try using "display: flex" for better header layout.');
  }

  // Check for styling
  const hasGradient = css.includes('gradient');
  const hasHover = css.includes(':hover');
  const hasTransition = css.includes('transition');
  
  if (hasGradient && hasHover && hasTransition) {
    objectives[3].completed = true;
    totalScore += objectives[3].points;
    feedback.push('✅ Outstanding visual design with gradients, hover effects, and transitions!');
  } else if (hasGradient || hasHover || hasTransition) {
    objectives[3].partial = true;
    totalScore += Math.floor(objectives[3].points / 2);
    feedback.push('⚠️ Good styling! Consider adding gradients, hover effects, or transitions.');
  } else {
    feedback.push('❌ Header needs more visual appeal. Try adding colors and hover effects.');
  }

  return {
    score: totalScore,
    maxScore: 100,
    feedback,
    objectives
  };
};

const validateCase2 = (_html: string, css: string): ValidationResult => {
  const objectives = [
    {
      id: 'button-hover',
      title: 'Add button hover effects',
      description: 'Implement :hover pseudo-class for buttons',
      completed: false,
      partial: false,
      points: 30
    },
    {
      id: 'transitions',
      title: 'Smooth transitions',
      description: 'Add CSS transitions for smooth animations',
      completed: false,
      partial: false,
      points: 25
    },
    {
      id: 'card-effects',
      title: 'Card hover effects',
      description: 'Add hover effects to offer cards',
      completed: false,
      partial: false,
      points: 25
    },
    {
      id: 'visual-feedback',
      title: 'Visual feedback',
      description: 'Implement shadows, transforms, and cursor changes',
      completed: false,
      partial: false,
      points: 20
    }
  ];

  const feedback: string[] = [];
  let totalScore = 0;

  // Check for button hover
  if (css.includes('.btn:hover') || css.includes('button:hover')) {
    objectives[0].completed = true;
    totalScore += objectives[0].points;
    feedback.push('✅ Excellent button hover effects implemented!');
  } else if (css.includes(':hover')) {
    objectives[0].partial = true;
    totalScore += Math.floor(objectives[0].points / 2);
    feedback.push('⚠️ Hover effects detected but not specifically for buttons.');
  } else {
    feedback.push('❌ Add :hover effects to make buttons interactive.');
  }

  // Check for transitions
  if (css.includes('transition')) {
    objectives[1].completed = true;
    totalScore += objectives[1].points;
    feedback.push('✅ Smooth transitions make the interface feel professional!');
  } else {
    feedback.push('❌ Add CSS transitions for smooth animations.');
  }

  // Check for card effects
  if (css.includes('.offer-card:hover') || css.includes('.card:hover')) {
    objectives[2].completed = true;
    totalScore += objectives[2].points;
    feedback.push('✅ Great card hover effects enhance user experience!');
  } else if (css.includes('transform') || css.includes('box-shadow')) {
    objectives[2].partial = true;
    totalScore += Math.floor(objectives[2].points / 2);
    feedback.push('⚠️ Visual effects detected but could be enhanced with card hover states.');
  } else {
    feedback.push('❌ Add hover effects to the offer cards for better interactivity.');
  }

  // Check for visual feedback
  const hasCursor = css.includes('cursor: pointer');
  const hasTransform = css.includes('transform');
  const hasShadow = css.includes('box-shadow');
  
  if (hasCursor && hasTransform && hasShadow) {
    objectives[3].completed = true;
    totalScore += objectives[3].points;
    feedback.push('✅ Perfect visual feedback with cursor, transforms, and shadows!');
  } else if (hasCursor || hasTransform || hasShadow) {
    objectives[3].partial = true;
    totalScore += Math.floor(objectives[3].points / 2);
    feedback.push('⚠️ Good visual feedback! Consider adding cursor pointer, transforms, or shadows.');
  } else {
    feedback.push('❌ Add visual feedback like cursor changes and shadows for better UX.');
  }

  return {
    score: totalScore,
    maxScore: 100,
    feedback,
    objectives
  };
};