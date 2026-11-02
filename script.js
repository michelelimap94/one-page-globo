
const GALLERIES = {
  portal: [
    {
      src: 'portal_interno.png',
      label: 'Interface principal do portal interno',
      caption: 'Visão das principais interfaces do Portal de Inteligência & Atacado, desenvolvido para centralizar informações, facilitar o acesso a relatórios e apoiar a comunicação entre equipes.'
    },
    {
      src: 'assets/images/mapa.jpg',
      label: 'Mapa de infraestrutura',
      caption: 'Visualização de infraestrutura de telecom.'
    },
    {
      src: 'assets/images/mapa-pontos.jpg',
      label: 'Data Centers e PoPs',
      caption: 'Detalhes dos Data Centers e PoPs.'
    },
    {
      src: 'assets/images/qgis.jpg',
      label: 'QGIS',
      caption: 'Exploração de dados geográficos no QGIS.'
    }
  ],

  automacao: [
    {
      src: 'assets/images/automacao.jpg',
      label: 'Automação Python e MySQL',
      caption: 'Fluxo de automação de dados.'
    },
    {
      src: 'assets/images/automacao-codigo.jpg',
      label: 'Código Python',
      caption: 'Código de processamento em Python.'
    },
    {
      src: 'assets/images/automacao-dados.jpg',
      label: 'Dados processados',
      caption: 'Organização dos dados de entrada.'
    },
    {
      src: 'assets/images/automacao-mysql.jpg',
      label: 'MySQL',
      caption: 'Carga e consulta de dados no MySQL.'
    }
  ],

  dados: [
    {
      src: 'dashboard-portabilidade.png',
      label: 'Dashboard de portabilidade',
      caption: 'Painel de indicadores de portabilidade: entradas, saídas, feedbacks e operadoras.'
    },
    {
      src: 'dashboard-isp.png',
      label: 'Dashboard do mercado ISP',
      caption: 'Painel de estrutura e consolidação do mercado de provedores de internet (ISP).'
    }
  ]
};

function media(item) {
  const el = document.createElement('div');
  el.className = 'm';

  const img = new Image();
  img.src = item.src;
  img.alt = item.label;

  img.addEventListener('error', () => {
    el.replaceChildren();
    const ph = document.createElement('div');
    ph.className = 'ph';
    ph.textContent = item.label;
    el.appendChild(ph);
  });

  el.appendChild(img);
  return el;
}

const lb = document.getElementById('lb');
const stage = document.getElementById('lb-media');

let current = { key: null, i: 0 };
let opener = null;

function render() {
  const list = GALLERIES[current.key];
  const item = list[current.i];

  stage.replaceChildren(media(item));

  document.getElementById('lb-cap').textContent = item.caption;
  document.getElementById('lb-count').textContent =
    (current.i + 1) + ' / ' + list.length;
}

function openLb(key) {
  opener = document.activeElement;
  current = { key, i: 0 };

  render();

  lb.hidden = false;
  document.body.classList.add('lock');
  document.getElementById('lb-x').focus();
}

function closeLb() {
  lb.hidden = true;
  document.body.classList.remove('lock');
  opener?.focus();
}

function step(d) {
  current.i =
    (current.i + d + GALLERIES[current.key].length) %
    GALLERIES[current.key].length;

  render();
}

document.querySelectorAll('.project').forEach(card => {
  const key = card.dataset.g;

  card.querySelector('.media').appendChild(
    media(GALLERIES[key][0])
  );

  card.querySelector('.thumb').addEventListener(
    'click',
    () => openLb(key)
  );
});

document.getElementById('lb-x').addEventListener('click', closeLb);
document.getElementById('lb-prev').addEventListener('click', () => step(-1));
document.getElementById('lb-next').addEventListener('click', () => step(1));

lb.addEventListener('click', e => {
  if (e.target === lb) closeLb();
});

document.addEventListener('keydown', e => {
  if (lb.hidden) return;

  if (e.key === 'Escape') closeLb();
  if (e.key === 'ArrowRight') step(1);
  if (e.key === 'ArrowLeft') step(-1);

  if (e.key === 'Tab') {
    const els = [...lb.querySelectorAll('button')];

    if (e.shiftKey && document.activeElement === els[0]) {
      e.preventDefault();
      els.at(-1).focus();
    } else if (
      !e.shiftKey &&
      document.activeElement === els.at(-1)
    ) {
      e.preventDefault();
      els[0].focus();
    }
  }
});

const facts = [...document.querySelectorAll('.fact')];

facts.forEach(f => {
  f.addEventListener('toggle', () => {
    if (f.open) {
      facts.forEach(other => {
        if (other !== f) other.open = false;
      });
    }
  });
});

function updateProgress() {
  const range =
    document.documentElement.scrollHeight - innerHeight;

  document.getElementById('progress').style.width =
    (range > 0 ? 100 * scrollY / range : 0) + '%';
}

addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

const sections = document.querySelectorAll('section[id]');
const navlinks = document.querySelectorAll('.links a');

const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navlinks.forEach(a =>
        a.classList.toggle(
          'on',
          a.hash === '#' + e.target.id
        )
      );
    }
  });
}, {
  rootMargin: '-30% 0px -55% 0px'
});

sections.forEach(s => observer.observe(s));

/* Cards da seção Quem sou:
   abre no hover, fecha ao sair;
   clique/toque segue nativo. */

if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  document.querySelectorAll('.fact').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.open = true;
    });

    card.addEventListener('mouseleave', () => {
      card.open = false;
    });
  });
}
