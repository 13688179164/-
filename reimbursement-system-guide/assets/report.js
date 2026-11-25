(function () {
  if (!window.mermaid) { return; }

  var cs = getComputedStyle(document.documentElement);
  function v(name) { return cs.getPropertyValue(name).trim(); }

  mermaid.initialize({
    startOnLoad: false,
    theme: 'base',
    securityLevel: 'loose',
    fontFamily: '"Instrument Sans","PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif',
    themeVariables: {
      background: v('--bg'),
      primaryColor: v('--accent-soft'),
      primaryBorderColor: v('--accent'),
      primaryTextColor: v('--ink'),
      secondaryColor: v('--bg2'),
      secondaryBorderColor: v('--rule'),
      secondaryTextColor: v('--ink'),
      tertiaryColor: v('--bg'),
      tertiaryBorderColor: v('--rule'),
      tertiaryTextColor: v('--muted'),
      lineColor: v('--muted'),
      textColor: v('--ink'),
      mainBkg: v('--accent-soft'),
      nodeBorder: v('--accent'),
      nodeTextColor: v('--ink'),
      clusterBkg: v('--bg2'),
      clusterBorder: v('--rule'),
      titleColor: v('--ink'),
      edgeLabelBackground: v('--bg'),
      actorBkg: v('--accent-soft'),
      actorBorder: v('--accent'),
      actorTextColor: v('--ink'),
      actorLineColor: v('--rule'),
      signalColor: v('--ink'),
      signalTextColor: v('--ink'),
      labelBoxBkgColor: v('--bg2'),
      labelBoxBorderColor: v('--rule'),
      labelTextColor: v('--ink'),
      loopTextColor: v('--ink'),
      noteBkgColor: v('--bg2'),
      noteBorderColor: v('--rule'),
      noteTextColor: v('--ink'),
      activationBkgColor: v('--accent-soft'),
      activationBorderColor: v('--accent'),
      sequenceNumberColor: v('--bg'),
      fontFamily: '"Instrument Sans","PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif'
    },
    flowchart: { curve: 'basis', useMaxWidth: true, htmlLabels: true, padding: 14, nodeSpacing: 34, rankSpacing: 44 },
    sequence: { useMaxWidth: true, actorMargin: 56, boxMargin: 10, messageFontSize: 13, actorFontSize: 13, noteFontSize: 12, mirrorActors: false },
    state: { useMaxWidth: true, nodeSpacing: 40, rankSpacing: 46 }
  });

  mermaid.run({ querySelector: 'pre.mermaid' });
})();
