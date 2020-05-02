const save = (cvs) => {
  const click = (node) => {
    try {
      node.dispatchEvent(new MouseEvent('click'));
    } catch (e) {
      const event = document.createElement('MouseEvents');
      event.initMouseEvent(
        'click',
        true,
        true,
        window,
        0,
        0,
        0,
        80,
        20,
        false,
        false,
        false,
        false,
        0,
        null,
      );
      node.dispatchEvent(event);
    }
  };

  if (cvs.toBlob) {
    cvs.toBlob((t) => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(t);
      a.download = `slide`;
      a.rel = 'noopener';

      setTimeout(() => {
        URL.revokeObjectURL(a.href);
      }, 4e4);
      setTimeout(() => {
        click(a);
      }, 0);
    });
  } else {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(cvs);
    a.download = `slide`;
    a.rel = 'noopener';

    setTimeout(() => {
      URL.revokeObjectURL(a.href);
    }, 4e4);
    setTimeout(() => {
      click(a);
    }, 0);
  }
};

export default save;
