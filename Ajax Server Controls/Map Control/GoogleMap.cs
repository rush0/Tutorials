using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.Xml.Linq;

namespace MapControl
{
    /// <summary>
    /// Summary description for GoogleMap
    /// </summary>
    public class GoogleMap : WebControl, IScriptControl
    {

        private int _Zoom = 8;
        public int Zoom { get { return this._Zoom; } set { _Zoom = value; } }
        
        public double CenterLatitude { get; set; }
        public double CenterLongitude { get; set; }


        public GoogleMap()
        {
            //
            // TODO: Add constructor logic here
            //
        }

        private ScriptManager sm;
        
        public IEnumerable<ScriptDescriptor>
                GetScriptDescriptors()
        {
            ScriptControlDescriptor descriptor = new ScriptControlDescriptor("MapControl.GoogleMap", this.ClientID);
            descriptor.AddProperty("Zoom", this.Zoom);
            descriptor.AddProperty("CenterLatitude", this.CenterLatitude);
            descriptor.AddProperty("CenterLongitude", this.CenterLongitude);
            yield return descriptor;
        }

        // Generate the script reference
        public IEnumerable<ScriptReference>
                GetScriptReferences()
        {
            yield return new ScriptReference("MapControl.GoogleMap.js", this.GetType().Assembly.FullName);
        }

        protected override HtmlTextWriterTag TagKey
        {
            get
            {
                return HtmlTextWriterTag.Div;
            }
        }

        protected override void OnPreRender(EventArgs e)
        {
            if (!this.DesignMode)
            {
                sm = ScriptManager.GetCurrent(Page);

                if (sm == null)
                   throw new HttpException("A ScriptManager control must exist on the page");

                sm.RegisterScriptControl(this);
            }
            base.OnPreRender(e);
        }

        protected override void Render(HtmlTextWriter writer)
        {
            if (!this.DesignMode)
                sm.RegisterScriptDescriptors(this);

            base.Render(writer);
        }
    }
}