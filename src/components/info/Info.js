import { Grid, Typography, Link } from '@mui/material';
import logo from './logo_dmwhisper.jpeg';
import { useTranslation } from 'react-i18next';

const Info = () => {
  const { t } = useTranslation();

  return (
    <Grid container sx={{ overflow: 'scroll' }}>
      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
        <Typography variant="h4">DM Whisper</Typography>
      </Grid>
      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
        <Typography m={2} variant='body'>v. 1.40.2</Typography>
      </Grid>
      <Grid item xs={12}>&nbsp;</Grid>
      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
        <img alt="DMWhisper logo" style={{ maxWidth: '98%', maxHeight: '98%' }} src={logo} />
      </Grid>
      <Grid item xs={12}>&nbsp;</Grid>
      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-start' }}>
        <Typography m={2} variant="h6">{t("An app that helps Dungeon Masters run Role Playing Games sessions, by rolling dice and instantly looking up table items, with a few twists.")}</Typography>
      </Grid>
      <Grid item xs={12}>&nbsp;</Grid>
      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-start' }}>
        <Typography m={2} variant="body">{t("By")} <Link href="mailto:maxmars@gmail.com">Massimiliano Marsiglietti</Link>, {t("published under the Apache 2.0 Open Source license.")}</Typography>
      </Grid>
      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-start' }}>
        <Typography m={2} variant="body">{t("See the product home page for information about the content JSON format.")}</Typography>
      </Grid>
      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
        <Link href="https://github.com/maxmars/dmwhisper">github.com/maxmars/dmwhisper</Link>
      </Grid>
      <Grid item xs={12}>&nbsp;</Grid>
      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
        <code>This project uses the following licensed third party libraries:<br />
        <br />
        CKEditor 5, which is licensed from CKSource (www.cksource.com).<br />
        <br />
        Please note that:<br />
        <br />
        THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT
        NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
        NONINFRINGEMENT. IN NO EVENT SHALL CKSOURCE OR ITS LICENSORS BE LIABLE FOR ANY CLAIM, DAMAGES
        OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR
        IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.<br />
        <br />
        The same conditions apply to DMWhisper -- it is provided "as is", without warranty of any kind, express or implied.
        Feel free to use it but please note that the authors are not responsible for any damage that may occur from its use.</code>
      </Grid>
      <Grid item xs={12}>&nbsp;</Grid>
    </Grid>
  );
};


export default Info;
